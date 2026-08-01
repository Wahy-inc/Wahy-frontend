"use client";

import { ADMIN_HOME, PARENT_HOME } from "@/components/dashboard/nav-items";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useSession } from "@/lib/session-context";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

interface RequireRoleProps {
	role: "sheikh" | "parent";
	children: ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
	const { session, isLoading } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (isLoading) {
			return;
		}
		if (!session) {
			router.replace("/platform/auth/signin");
		} else if (session.role !== role) {
			// Signed in with the wrong role; go to that role's own home.
			router.replace(session.role === "sheikh" ? ADMIN_HOME : PARENT_HOME);
		}
	}, [isLoading, session, role, router]);

	if (isLoading) {
		return (
			<div className="p-6">
				<LoadingSkeleton rows={4} />
			</div>
		);
	}
	if (!session || session.role !== role) {
		return null; // Redirect is in flight.
	}
	return <>{children}</>;
}
