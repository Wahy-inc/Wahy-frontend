"use client";

/**
 * Session context.
 *
 * The session is resolved from `GET /auth/me`, which authenticates through
 * the HTTP-only cookies the browser holds. There are no tokens in
 * localStorage. When the transport refresh fails, it dispatches
 * `wahy:unauthorized`, which clears the cached session here.
 */
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, signOut as apiSignOut } from "@/lib/api/auth";
import { UNAUTHORIZED_EVENT } from "@/lib/api/client";
import type { UserMeRead } from "@/lib/data-contracts";

export type SessionRole = UserMeRead["role"];

export interface Session {
	id: number;
	email: string;
	role: SessionRole;
}

export const SESSION_QUERY_KEY = ["session"] as const;

interface SessionContextValue {
	session: Session | null;
	isLoading: boolean;
	/** Clears cookies on the backend and drops the cached session. */
	signOut: () => Promise<void>;
	/** Re-queries /auth/me (call after sign-in / activation). */
	refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();

	const { data, isLoading, refetch } = useQuery({
		queryKey: SESSION_QUERY_KEY,
		queryFn: async () => {
			const me = await getMe();
			return {
				id: me.id,
				email: me.email,
				role: me.role,
			} satisfies Session;
		},
		retry: false,
		staleTime: 5 * 60 * 1000,
	});

	const clearSession = useCallback(() => {
		queryClient.setQueryData(SESSION_QUERY_KEY, null);
	}, [queryClient]);

	useEffect(() => {
		const handleUnauthorized = () => clearSession();
		window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
		return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
	}, [clearSession]);

	const signOut = useCallback(async () => {
		try {
			await apiSignOut();
		} catch {
			// The backend session is already invalid or unreachable; clear locally.
		}
		clearSession();
	}, [clearSession]);

	const refreshSession = useCallback(async () => {
		await refetch();
	}, [refetch]);

	const value = useMemo(
		() => ({
			session: data ?? null,
			isLoading,
			signOut,
			refreshSession,
		}),
		[data, isLoading, signOut, refreshSession],
	);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
	const context = useContext(SessionContext);
	if (!context) {
		throw new Error("useSession must be used within a SessionProvider");
	}
	return context;
}
