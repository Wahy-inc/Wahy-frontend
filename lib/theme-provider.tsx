"use client";

import {
	createContext,
	useContext,
	useLayoutEffect,
	useSyncExternalStore,
	type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "wahy-theme";

// The theme lives in a module-level store. The server snapshot is always
// "light" so SSR output matches the client's first hydration render; the
// saved/system theme is adopted right after hydration via useSyncExternalStore
// (no hydration mismatch, no setState-in-effect).
let currentTheme: Theme = "light";
const themeListeners = new Set<() => void>();

function subscribeTheme(onChange: () => void): () => void {
	themeListeners.add(onChange);
	return () => {
		themeListeners.delete(onChange);
	};
}

function getThemeSnapshot(): Theme {
	return currentTheme;
}

function getServerTheme(): Theme {
	return "light";
}

function readSavedTheme(): Theme {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved === "light" || saved === "dark") {
			return saved;
		}
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	} catch {
		return "light";
	}
}

if (typeof window !== "undefined") {
	currentTheme = readSavedTheme();
}

function applyThemeClass(theme: Theme) {
	document.documentElement.classList.toggle("dark", theme === "dark");
}

function setTheme(next: Theme) {
	currentTheme = next;
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch {
		// Storage unavailable (private mode / restricted browser).
	}
	applyThemeClass(next);
	themeListeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const theme = useSyncExternalStore(
		subscribeTheme,
		getThemeSnapshot,
		getServerTheme,
	);

	// Keep <html class="dark"> in sync. Reads the real client value so the
	// transient hydration value never strips the pre-hydration class.
	useLayoutEffect(() => {
		applyThemeClass(currentTheme);
	}, [theme]);

	const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
