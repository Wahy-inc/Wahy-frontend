/**
 * Enhanced API client wrapper that implements request deduplication
 * Automatically cancels previous pending requests for the same endpoint
 */

import { Api, RequestParams } from './openApi';
import { requestManager } from './requestManager';

type MethodNames = keyof Api['api'];

/**
 * Wraps API methods to automatically cancel duplicate pending requests
 */
export function createDeduplicatedApiClient(apiInstance: Api<unknown>) {
  const originalRequest = apiInstance.request.bind(apiInstance);

  // Override the request method to handle deduplication
  apiInstance.request = async function (config) {
    const { path, method = 'GET', query } = config;

    // Register request and get cancel token
    const { cancelToken, cleanup } = requestManager.registerRequest(method, path, query);

    try {
      // Execute request with the cancel token
      const result = await originalRequest({
        ...config,
        cancelToken,
      });

      cleanup();
      return result;
    } catch (error) {
      cleanup();
      // Re-throw if it's not an abort error
      if (error instanceof Error && error.name !== 'AbortError') {
        throw error;
      }
      // Abort errors are expected when cancelling, so we suppress them
      console.log('[API] Request was cancelled');
      throw error;
    }
  } as any;

  return apiInstance;
}

export { requestManager };
