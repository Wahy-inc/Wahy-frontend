import { ApiError } from "@/lib/api/client";

/** Extract a displayable message from an unknown error. */
export function errorMessage(err: unknown, fallback = "Something went wrong"): string {
	return err instanceof ApiError ? err.message : fallback;
}
