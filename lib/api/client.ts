/**
 * Typed fetch transport for the Wahy backend API.
 *
 * Auth model: the backend sets HTTP-only `access_token` / `refresh_token`
 * cookies. This client sends `credentials: "include"` so the browser manages
 * the cookies; it never reads or stores tokens in JavaScript.
 *
 * On 401 it performs a single-flight refresh (POST /auth/refresh) and retries
 * the original request once. If the refresh fails, it dispatches a
 * `wahy:unauthorized` window event so the session context can reset.
 */

export class ApiError extends Error {
	readonly status: number;
	readonly detail: unknown;

	constructor(status: number, detail: unknown) {
		super(formatDetail(detail, status));
		this.name = "ApiError";
		this.status = status;
		this.detail = detail;
	}
}

export function formatDetail(detail: unknown, status: number): string {
	if (typeof detail === "string" && detail.length > 0) {
		return detail;
	}
	if (Array.isArray(detail)) {
		const messages = detail
			.map((item) => {
				if (item && typeof item === "object" && "msg" in item) {
					return String((item as { msg: unknown }).msg);
				}
				return String(item);
			})
			.filter((msg) => msg.length > 0);
		if (messages.length > 0) {
			return messages.join("; ");
		}
	}
	return `Request failed with status ${status}`;
}

export const UNAUTHORIZED_EVENT = "wahy:unauthorized";

export const BACKEND_URL =
	process.env.NEXT_PUBLIC_BACKEND_URL ||
	process.env.NEXT_PUBLIC_API_URL ||
	"";

type QueryValue = string | number | boolean | null | undefined;

function buildQuery(query: Record<string, QueryValue | QueryValue[]> | undefined): string {
	if (!query) {
		return "";
	}
	const params = new URLSearchParams();
	for (const [key, raw] of Object.entries(query)) {
		if (raw === undefined || raw === null) {
			continue;
		}
		const values = Array.isArray(raw) ? raw : [raw];
		for (const value of values) {
			if (value !== undefined && value !== null) {
				params.append(key, String(value));
			}
		}
	}
	const serialized = params.toString();
	return serialized ? `?${serialized}` : "";
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
			method: "POST",
			credentials: "include",
			headers: { Accept: "application/json" },
		});
		if (response.ok) {
			return true;
		}
	} catch {
		// Network failure; fall through to the failure path below.
	}
	// Any failed refresh (missing/expired cookie, network error, or 5xx)
	// means the session cannot continue.
	window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
	return false;
}

export interface RequestOptions {
	method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
	/** JSON body; serialized with Content-Type application/json. */
	body?: unknown;
	/** Multipart body; sent as-is with no Content-Type header. */
	formData?: FormData;
	query?: Record<string, QueryValue | QueryValue[]>;
	/** Treat the response as a Blob (pdf, files, ics feeds). */
	blob?: boolean;
}

async function perform<T>(
	path: string,
	options: RequestOptions,
	allowRetry: boolean,
): Promise<T> {
	const { method = "GET", body, formData, query, blob = false } = options;

	const headers: Record<string, string> = { Accept: "application/json" };
	if (body !== undefined) {
		headers["Content-Type"] = "application/json";
	}

	const response = await fetch(`${BACKEND_URL}${path}${buildQuery(query)}`, {
		method,
		credentials: "include",
		headers,
		body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
	});

	if (response.status === 401 && allowRetry) {
		refreshPromise ??= refreshAccessToken().finally(() => {
			refreshPromise = null;
		});
		const refreshed = await refreshPromise;
		if (refreshed) {
			return perform<T>(path, options, false);
		}
	}

	if (!response.ok) {
		let detail: unknown;
		try {
			const payload = await response.json();
			detail =
				payload && typeof payload === "object" && "detail" in payload
					? payload.detail
					: payload;
		} catch {
			detail = await response.text().catch(() => undefined);
		}
		throw new ApiError(response.status, detail);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	if (blob) {
		return (await response.blob()) as T;
	}

	const contentType = response.headers.get("content-type") ?? "";
	if (contentType.includes("application/json")) {
		return (await response.json()) as T;
	}
	return (await response.text()) as T;
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
	return perform<T>(path, options, true);
}
