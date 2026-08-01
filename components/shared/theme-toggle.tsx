"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-provider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={toggleTheme}
			aria-label={
				theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
			}
		>
			{theme === "dark" ? (
				<Sun className="size-4" />
			) : (
				<Moon className="size-4" />
			)}
		</Button>
	);
}
