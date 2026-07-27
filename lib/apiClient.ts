/**
 * Centralized API initialization with request deduplication
 * Use this instead of creating new Api instances directly
 * 
 * Behavior: First request completes, all duplicate requests are cancelled
 */

import * as openApi from '@/lib/openApi';
import { requestManager } from '@/lib/requestManager';

// Security worker that fetches the current access token from localStorage
const securityWorker = async (): Promise<{ headers: { Authorization?: string } }> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

// Create the API instance once.
// Use NEXT_PUBLIC_BACKEND_URL for direct cross-origin calls to the backend.
// Bypasses the Next.js server-side rewrite proxy, which strips client
// cookies and can drop Authorization headers on POST (causing 401).
const backendUrl = (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL)) || '';

const baseApi = new openApi.Api<unknown>({
  baseUrl: backendUrl,
  securityWorker,
});

// Get the original request method
const originalRequest: typeof baseApi.request = baseApi.request.bind(baseApi);

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

// Override request method to handle request deduplication, binary formats, and 401 token refresh
baseApi.request = (async function <T = unknown, E = unknown>(config: openApi.FullRequestParams): Promise<openApi.HttpResponse<T, E>> {
  const { path, method = 'GET', query } = config;
  const isRefreshEndpoint = path?.includes('/refresh');
  const isBinaryEndpoint = path?.includes('/pdf') || path?.includes('/download');

  // Register the request
  const { cancelToken, cleanup, shouldCancel } = requestManager.registerRequest(method, path, query);

  // If another request for the same endpoint is already pending, cancel this one
  if (shouldCancel) {
    const error = new DOMException('Request cancelled - duplicate pending request', 'AbortError');
    throw error;
  }

  try {
    // Check if this is a binary file endpoint - force blob format to prevent JSON parsing 
    //not include || path?.includes('/files') because some file endpoints return JSON responses (e.g. file metadata)
    const requestConfig = {
      ...config,
      cancelToken,
      // Override format to 'blob' for binary endpoints to prevent JSON parsing
      ...(isBinaryEndpoint && { format: 'blob' }),
    } satisfies openApi.FullRequestParams;

    // console.log('[apiClient] Request:', { path, isBinaryEndpoint, format: requestConfig.format });

    // Execute request with the cancel token
    const result = await originalRequest<T, E>(requestConfig);

    // console.log('[apiClient] Response:', { path, status: result.status, dataType: typeof result.data, dataIsBlob: result.data instanceof Blob, dataSize: result.data?.size });

    cleanup();
    return result;
  } catch (error) {
    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status?: number }).status
        : undefined;

    if (status === 401 && !isRefreshEndpoint) {
      try {
        // If a refresh is already in progress, wait for it
        if (isRefreshing && refreshPromise) {
          await refreshPromise;
        } else {
          // Start a new refresh
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              // Use dynamic import to avoid circular dependency
              const { refreshAccessToken } = await import('@/app/platform/actions/auth');
              await refreshAccessToken();
            } catch (refreshError) {
              // Refresh failed - redirect to login
              if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('expire');
                window.location.href = '/';
              }
              throw refreshError;
            } finally {
              isRefreshing = false;
              refreshPromise = null;
            }
          })();

          await refreshPromise;
        }

        const retryRequestConfig = {
          ...config,
          cancelToken,
          ...(isBinaryEndpoint ? { format: 'blob' } : {}),
        } satisfies openApi.FullRequestParams;

        const retriedResult = await originalRequest<T, E>(retryRequestConfig);
        cleanup();
        return retriedResult;
      } catch (refreshOrRetryError) {
        cleanup();
        throw refreshOrRetryError;
      }
    }

    cleanup();

    // Check if this is an abort error (expected when cancelling duplicate requests)
    // if (error instanceof Error && error.name === 'AbortError') {
    //   console.log(`[API] Request cancelled: ${method} ${path}`);
    // }

    throw error;
  }
}) as typeof baseApi.request;

/**
 * Get the deduplicated API instance
 * Use this instead of creating new Api instances
 */
export function getApi() {
  return baseApi;
}

/**
 * Cancel all pending requests
 */
export function cancelAllRequests() {
  requestManager.cancelAll();
}

/**
 * Get number of pending requests
 */
export function getPendingRequestsCount() {
  return requestManager.getPendingCount();
}

export { requestManager };
