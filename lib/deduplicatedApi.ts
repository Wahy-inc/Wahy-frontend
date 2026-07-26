/**
 * Enhanced API client wrapper that implements request deduplication
 * Automatically cancels previous pending requests for the same endpoint
 */

import { Api } from './openApi';
import { requestManager } from './requestManager';

/**
 * Wraps API methods to automatically cancel duplicate pending requests
 */
export function createDeduplicatedApiClient(apiInstance: Api<unknown>) {
  const originalRequest = apiInstance.request.bind(apiInstance);

  // Override the request method to handle deduplication
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiInstance.request = async function (config: any) {
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
      throw error;
    }
  } as unknown as typeof apiInstance.request;

  return apiInstance;
}

export { requestManager };
