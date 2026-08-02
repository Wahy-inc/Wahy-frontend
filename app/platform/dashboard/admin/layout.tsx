"use client";

import { AppShell } from "@/components/dashboard/app-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return (
		<RequireRole role="sheikh">
			<AppShell role="sheikh">{children}</AppShell>
		</RequireRole>
	);
}
