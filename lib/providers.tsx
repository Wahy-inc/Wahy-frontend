"use client";

import { Toaster } from "sonner";
import { LocalizationProvider } from "@/lib/localization-context";
import { QueryProvider } from "@/lib/query-provider";
import { SessionProvider } from "@/lib/session-context";
import { ThemeProvider } from "@/lib/theme-provider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<LocalizationProvider>
			<ThemeProvider>
				<QueryProvider>
					<SessionProvider>
						{children}
						<Toaster position="top-center" richColors />
					</SessionProvider>
				</QueryProvider>
			</ThemeProvider>
		</LocalizationProvider>
	);
}
