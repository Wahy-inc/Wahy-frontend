"use client";

import {
	createContext,
	useContext,
	ReactNode,
	useLayoutEffect,
	useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import { setUILanguage, type UILanguage } from "@/lib/i18n-locale";
import en from "@/lib/localization/en.json";
import ar from "@/lib/localization/ar.json";
import ru from "@/lib/localization/ru.json";
import fr from "@/lib/localization/fr.json";
import de from "@/lib/localization/de.json";
import es from "@/lib/localization/es.json";

type Language = UILanguage;

interface LocalizationContextType {
	language: Language;
	setLanguage: (language: Language) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
	undefined,
);

const translations: Record<Language, Record<string, unknown>> = {
	en,
	ar,
	ru,
	fr,
	de,
	es,
};

// Flattened key → string map ("lang:ns.key" → value) for O(1) lookups.
const translationMap = new Map<string, string>();
function flattenTranslations() {
	const walk = (
		obj: Record<string, unknown>,
		prefix: string,
		lang: Language,
	) => {
		for (const [key, value] of Object.entries(obj)) {
			const path = prefix ? `${prefix}.${key}` : key;
			if (typeof value === "object" && value !== null) {
				walk(value as Record<string, unknown>, path, lang);
			} else if (typeof value === "string") {
				translationMap.set(`${lang}:${path}`, value);
			}
		}
	};
	for (const lang of LANGUAGES) {
		walk(translations[lang] as Record<string, unknown>, "", lang);
	}
}

const LANGUAGES: readonly Language[] = ["en", "ar", "ru", "fr", "de", "es"];
flattenTranslations();

// The language lives in a module-level store. The server snapshot is always
// "en" so SSR output matches the client's first hydration render; the saved
// language is adopted right after hydration via useSyncExternalStore (no
// hydration mismatch, no setState-in-effect).
let currentLanguage: Language = "en";
const languageListeners = new Set<() => void>();

function subscribeLanguage(onChange: () => void): () => void {
	languageListeners.add(onChange);
	return () => {
		languageListeners.delete(onChange);
	};
}

function getLanguageSnapshot(): Language {
	return currentLanguage;
}

function getServerLanguage(): Language {
	return "en";
}

function readSavedLanguage(): Language {
	try {
		const saved = localStorage.getItem("language") as Language | null;
		if (saved && (LANGUAGES as readonly string[]).includes(saved)) {
			return saved;
		}
	} catch {
		// Storage unavailable (private mode / restricted browser).
	}
	return "en";
}

if (typeof window !== "undefined") {
	currentLanguage = readSavedLanguage();
}

function setLanguage(next: Language) {
	currentLanguage = next;
	setUILanguage(next);
	try {
		localStorage.setItem("language", next);
	} catch {
		// Storage unavailable (private mode / restricted browser).
	}
	languageListeners.forEach((listener) => listener());
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const language = useSyncExternalStore(
		subscribeLanguage,
		getLanguageSnapshot,
		getServerLanguage,
	);

	// Apply before paint so the first rendered frame already uses the
	// active locale and direction. Reads the real client value so the
	// transient hydration value never shows the wrong direction. Any
	// Arabic locale gets RTL, including the dashboard; others stay LTR.
	useLayoutEffect(() => {
		setUILanguage(currentLanguage);
		document.documentElement.lang = currentLanguage;
		document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
	}, [language, pathname]);

	const t = (key: string, vars?: Record<string, string | number>): string => {
		const value = translationMap.get(`${language}:${key}`);
		if (value === undefined) {
			return key;
		}
		if (!vars) {
			return value;
		}
		return value.replace(/\{(\w+)\}/g, (match, name: string) =>
			name in vars ? String(vars[name]) : match,
		);
	};

	return (
		<LocalizationContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LocalizationContext.Provider>
	);
}

export function useLocalization() {
	const context = useContext(LocalizationContext);
	if (!context) {
		return {
			language: "en" as Language,
			setLanguage: () => {},
			t: (key: string) => key,
		};
	}
	return context;
}

export type { LocalizationContextType };
