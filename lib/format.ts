/**
 * Display formatters shared across pages.
 */

import { intlLocale } from "@/lib/i18n-locale";

/**
 * Format an amount as USD. Wahy only ever bills in USD; the formatting
 * follows the active UI language (e.g. Arabic digits for `ar`).
 */
export function formatCurrency(
	amount: number | string | null | undefined,
): string {
	if (amount === null || amount === undefined || amount === "") {
		return "";
	}
	const numeric = typeof amount === "string" ? Number(amount) : amount;
	return new Intl.NumberFormat(intlLocale(), {
		style: "currency",
		currency: "USD",
	}).format(numeric);
}

export function formatBytes(bytes: number | null | undefined): string {
	if (bytes === null || bytes === undefined) {
		return "";
	}
	if (bytes < 1024) {
		return `${bytes} B`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(1)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatPercent(
	value: number | null | undefined,
	isFraction = false,
): string {
	if (value === null || value === undefined || Number.isNaN(value)) {
		return "";
	}
	const numeric = isFraction ? value * 100 : value;
	return `${numeric.toFixed(1)}%`;
}
