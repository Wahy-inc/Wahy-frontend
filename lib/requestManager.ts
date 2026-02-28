/**
 * Request Manager - Handles deduplication and cancellation of pending requests
 * When a new request is made for the same endpoint while one is already pending,
 * the new request is cancelled instead. Only the first request is allowed to complete.
 */

type RequestKey = string;

interface PendingRequest {
  cancelToken: Symbol;
  abortController: AbortController;
  timestamp: number;
}

class RequestManager {
  private pendingRequests = new Map<RequestKey, PendingRequest>();

  /**
   * Generate a unique key for a request based on method and path
   */
  private generateRequestKey(method: string, path: string, query?: Record<string, any>): RequestKey {
    // Include query params in the key to differentiate requests with different filters
    const queryString = query ? JSON.stringify(query) : '';
    return `${method}:${path}:${queryString}`;
  }

  /**
   * Register a new pending request
   * If a request for the same endpoint is already pending, the NEW request is cancelled
   * This allows the first request to complete while all duplicates are discarded
   */
  public registerRequest(
    method: string,
    path: string,
    query?: Record<string, any>,
  ): {
    cancelToken: Symbol;
    cleanup: () => void;
    shouldCancel: boolean;
  } {
    const requestKey = this.generateRequestKey(method, path, query);

    // Check if a request for the same endpoint already exists
    const existingRequest = this.pendingRequests.get(requestKey);
    
    if (existingRequest) {
      // Request already pending - this new request should be cancelled
      console.log(`[RequestManager] Request already pending, cancelling new request: ${requestKey}`);
      
      const cancelToken = Symbol(`${requestKey}:${Date.now()}:cancelled`);
      return {
        cancelToken,
        cleanup: () => {},
        shouldCancel: true,
      };
    }

    // No existing request - proceed with this one
    const cancelToken = Symbol(`${requestKey}:${Date.now()}`);
    const abortController = new AbortController();

    // Store the pending request
    this.pendingRequests.set(requestKey, {
      cancelToken,
      abortController,
      timestamp: Date.now(),
    });

    // Return cleanup function to be called when request completes
    const cleanup = () => {
      this.pendingRequests.delete(requestKey);
    };

    return { cancelToken, cleanup, shouldCancel: false };
  }

  /**
   * Cancel a specific request by its key
   */
  public cancelRequest(method: string, path: string, query?: Record<string, any>): void {
    const requestKey = this.generateRequestKey(method, path, query);
    const request = this.pendingRequests.get(requestKey);

    if (request) {
      console.log(`[RequestManager] Manually cancelling request: ${requestKey}`);
      request.abortController.abort();
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Cancel all pending requests
   */
  public cancelAll(): void {
    console.log(`[RequestManager] Cancelling all ${this.pendingRequests.size} pending requests`);
    this.pendingRequests.forEach((request) => {
      request.abortController.abort();
    });
    this.pendingRequests.clear();
  }

  /**
   * Get the number of pending requests
   */
  public getPendingCount(): number {
    return this.pendingRequests.size;
  }

  /**
   * Get list of pending request keys
   */
  public getPendingRequests(): RequestKey[] {
    return Array.from(this.pendingRequests.keys());
  }
}

export const requestManager = new RequestManager();
