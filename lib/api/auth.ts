/**
 * Auth domain API functions.
 *
 * Sign-in, sign-up, activation, and refresh endpoints set HTTP-only cookies
 * on the backend; the transport sends `credentials: "include"` so the browser
 * persists them automatically.
 */
import { api } from "./client";
import type {
	ActivateRequest,
	LoginRequest,
	ResetRequestCreate,
	ResetRequestRead,
	ResetRequestStatus,
	TokenResponse,
	UserMeRead,
} from "../data-contracts";

export interface InviteCodeResponse {
	code: string;
	expires_at: string;
}

export function signIn(payload: LoginRequest): Promise<TokenResponse> {
	return api<TokenResponse>("/api/v1/auth/signin", {
		method: "POST",
		body: payload,
	});
}

export function activate(payload: ActivateRequest): Promise<TokenResponse> {
	return api<TokenResponse>("/api/v1/auth/activate", {
		method: "POST",
		body: payload,
	});
}

export function requestPasswordReset(
	payload: ResetRequestCreate,
): Promise<void> {
	return api<void>("/api/v1/auth/reset-request", {
		method: "POST",
		body: payload,
	});
}

export function listResetRequests(
	status?: ResetRequestStatus | null,
): Promise<ResetRequestRead[]> {
	return api<ResetRequestRead[]>("/api/v1/auth/reset-requests", {
		query: status ? { status } : undefined,
	});
}

export function approveResetRequest(
	requestId: number,
): Promise<InviteCodeResponse> {
	return api<InviteCodeResponse>(
		`/api/v1/auth/reset-requests/${requestId}/approve`,
		{
			method: "POST",
		},
	);
}

export function rejectResetRequest(requestId: number): Promise<void> {
	return api<void>(`/api/v1/auth/reset-requests/${requestId}/reject`, {
		method: "POST",
	});
}

export function getMe(): Promise<UserMeRead> {
	return api<UserMeRead>("/api/v1/auth/me");
}

export function signOut(): Promise<void> {
	return api<void>("/api/v1/auth/logout", { method: "POST" });
}
