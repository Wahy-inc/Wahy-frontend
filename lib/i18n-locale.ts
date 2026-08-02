import { ar, de, enUS, es, fr, ru, type Locale } from "date-fns/locale";

export type UILanguage = "en" | "ar" | "ru" | "fr" | "de" | "es";

const DATE_LOCALES: Record<UILanguage, Locale> = {
	en: enUS,
	ar,
	ru,
	fr,
	de,
	es,
};

const INTL_LOCALES: Record<UILanguage, string> = {
	en: "en-US",
	ar: "ar",
	ru: "ru",
	fr: "fr",
	de: "de",
	es: "es",
};

let active: UILanguage = "en";

/** Set the active UI language (called by the localization provider). */
export function setUILanguage(language: UILanguage): void {
	active = language;
}

export function uiLanguage(): UILanguage {
	return active;
}

/** Locale for date-fns formatting. */
export function dateFnsLocale(): Locale {
	return DATE_LOCALES[active];
}

/** BCP-47 tag for Intl.* formatting. */
export function intlLocale(): string {
	return INTL_LOCALES[active];
}
