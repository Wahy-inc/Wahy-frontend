"use client";

import { AppShell } from "@/components/dashboard/app-shell";
import { RequireRole } from "@/components/dashboard/require-role";
import type { ReactNode } from "react";

export default function ParentLayout({ children }: { children: ReactNode }) {
	return (
		<RequireRole role="parent">
			<AppShell role="parent">{children}</AppShell>
		</RequireRole>
	);
}
