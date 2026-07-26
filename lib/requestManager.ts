/**
 * Request Manager - Handles deduplication and cancellation of pending requests
 * When a new request is made for the same endpoint while one is already pending,
 * the new request is cancelled instead. Only the first request is allowed to complete.
 */

type RequestKey = string;

interface PendingRequest {
  cancelToken: symbol;
  abortController: AbortController;
  timestamp: number;
}

class RequestManager {
  private pendingRequests = new Map<RequestKey, PendingRequest>();

  /**
   * Generate a unique key for a request based on method and path
   */
  private generateRequestKey(method: string, path: string, query?: Record<string, unknown>): RequestKey {
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
    query?: Record<string, unknown>,
  ): {
    cancelToken: symbol;
    cleanup: () => void;
    shouldCancel: boolean;
  } {
    const requestKey = this.generateRequestKey(method, path, query);
    const existingRequest = this.pendingRequests.get(requestKey);
    
    if (existingRequest) {
      const cancelToken = Symbol(`${requestKey}:${Date.now()}:cancelled`);
      return {
        cancelToken,
        cleanup: () => {},
        shouldCancel: true,
      };
    }

    const cancelToken = Symbol(`${requestKey}:${Date.now()}`);
    const abortController = new AbortController();

    this.pendingRequests.set(requestKey, {
      cancelToken,
      abortController,
      timestamp: Date.now(),
    });

    const cleanup = () => {
      this.pendingRequests.delete(requestKey);
    };

    return { cancelToken, cleanup, shouldCancel: false };
  }

  /**
   * Cancel a specific request by its key
   */
  public cancelRequest(method: string, path: string, query?: Record<string, unknown>): void {
    const requestKey = this.generateRequestKey(method, path, query);
    const request = this.pendingRequests.get(requestKey);

    if (request) {
      request.abortController.abort();
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Cancel all pending requests
   */
  public cancelAll(): void {
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
