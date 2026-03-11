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

// Create the API instance once
const baseApi = new openApi.Api<unknown>({
  baseUrl: '',
  securityWorker,
});

// Get the original request method
const originalRequest = baseApi.request.bind(baseApi);

// Override request method to handle request deduplication
baseApi.request = async function (config: any) {
  const { path, method = 'GET', query } = config;

  // Register the request
  const { cancelToken, cleanup, shouldCancel } = requestManager.registerRequest(method, path, query);

  // If another request for the same endpoint is already pending, cancel this one
  if (shouldCancel) {
    const error = new DOMException('Request cancelled - duplicate pending request', 'AbortError');
    throw error;
  }

  try {
    // Execute request with the cancel token
    const result = await originalRequest({
      ...config,
      cancelToken,
    } as any);

    cleanup();
    return result;
  } catch (error) {
    cleanup();

    // Check if this is an abort error (expected when cancelling duplicate requests)
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`[API] Request cancelled: ${method} ${path}`);
    }

    throw error;
  }
} as any;

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
