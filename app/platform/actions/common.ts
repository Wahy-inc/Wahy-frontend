/**
 * Shared API helper for Next.js server actions.
 * Wraps API requests with error handling, status checking, and type-safe response structures.
 */

export interface ActionResponse<T = unknown> {
  message: string;
  data?: T;
  error?: Record<string, string[]>;
}

export async function handleApiCall<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiFn: () => Promise<{ status: number; data?: T; error?: any }>,
  successStatus: number = 200,
  successMessage: string = 'success',
): Promise<ActionResponse<T>> {
  try {
    const response = await apiFn();
    if (response.status === successStatus && response.data !== undefined) {
      return { message: successMessage, data: response.data };
    }
    const errObj = response.error as { detail?: Array<{ msg?: string }> | string } | undefined;
    const errMsg = typeof errObj?.detail === 'string' ? errObj.detail : errObj?.detail?.[0]?.msg || 'fail';
    return { message: errMsg };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'An unexpected error occurred';
    return { message: msg };
  }
}
