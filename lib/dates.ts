/**
 * Date helpers. The backend stores dates as `YYYY-MM-DD`, times as
 * `HH:MM:SS` (UTC), and datetimes as ISO 8601 UTC. All formatting goes
 * through date-fns; plain `YYYY-MM-DD` values are treated as calendar dates.
 * Formatting is forced to UTC so calendar dates never shift with the
 * browser timezone.
 */
import { format, parseISO } from "date-fns";

import { dateFnsLocale } from "@/lib/i18n-locale";

/**
 * Shift a date so the browser renders its UTC wall-clock time.
 * `format` renders in the local timezone; this cancels the offset so
 * calendar dates never shift with the browser timezone.
 */
function asUTCDisplay(date: Date): Date {
	return new Date(date.getTime() + date.getTimezoneOffset() * 60_000);
}

/** Parse `YYYY-MM-DD` without timezone shifting. */
export function parseDateOnly(value: string): Date {
	const [year, month, day] = value.split("-").map(Number);
	return new Date(Date.UTC(year, month - 1, day));
}

/** Format a `YYYY-MM-DD` value for display (e.g. "12 Mar 2026"). */
export function formatDate(
	value: string | null | undefined,
	pattern = "d MMM yyyy",
): string {
	if (!value) {
		return "";
	}
	return format(asUTCDisplay(parseDateOnly(value)), pattern, {
		locale: dateFnsLocale(),
	});
}

/** Format a `HH:MM:SS` value for display (e.g. "14:30"). */
export function formatTime(value: string | null | undefined): string {
	if (!value) {
		return "";
	}
	const [hours, minutes] = value.split(":");
	if (parseInt(hours) < 12) {
		return `${hours}:${minutes} AM`;
	} else if (parseInt(hours) === 12) {
		return `${hours}:${minutes} PM`;
	}
	return `${parseInt(hours) - 12}:${minutes} PM`;
}

/** Format an ISO 8601 UTC datetime for display. */
export function formatDateTime(
	value: string | null | undefined,
	pattern = "d MMM yyyy, HH:mm",
): string {
	if (!value) {
		return "";
	}
	return format(asUTCDisplay(parseISO(value)), pattern, {
		locale: dateFnsLocale(),
	});
}

/** Today as `YYYY-MM-DD` (UTC). */
export function todayISO(): string {
	return format(asUTCDisplay(new Date()), "yyyy-MM-dd", {
		locale: dateFnsLocale(),
	});
}

/** Shift a `YYYY-MM-DD` value by `days` days. */
export function shiftDate(value: string, days: number): string {
	const date = parseDateOnly(value);
	date.setUTCDate(date.getUTCDate() + days);
	return format(asUTCDisplay(date), "yyyy-MM-dd", { locale: dateFnsLocale() });
}

/** `YYYY-MM-DD` for the first day of the current UTC month. */
export function monthStartISO(): string {
	return format(asUTCDisplay(new Date()), "yyyy-MM-01", {
		locale: dateFnsLocale(),
	});
}

/** Human-readable range label, e.g. "1 - 30 Jun 2026". */
export function rangeLabel(start: string, end: string): string {
	const startDate = parseDateOnly(start);
	const endDate = parseDateOnly(end);
	if (
		startDate.getUTCMonth() === endDate.getUTCMonth() &&
		startDate.getUTCFullYear() === endDate.getUTCFullYear()
	) {
		return `${startDate.getUTCDate()} - ${format(asUTCDisplay(endDate), "d MMM yyyy", { locale: dateFnsLocale() })}`;
	}
	return `${format(asUTCDisplay(startDate), "d MMM", { locale: dateFnsLocale() })} - ${format(asUTCDisplay(endDate), "d MMM yyyy", { locale: dateFnsLocale() })}`;
}

/**
 * Minutes until an event, e.g. "In 2 h 5 min". Pass the translation
 * function to localize; falls back to English.
 */
export function formatMinutesUntil(
	minutes: number,
	t?: (key: string, vars?: Record<string, string | number>) => string,
): string {
	const tr =
		t ??
		((key: string, vars?: Record<string, string | number>) => {
			const english: Record<string, string> = {
				"time.starting_now": "Starting now",
				"time.in_minutes": "In {count} min",
				"time.in_hours": "In {count} h",
				"time.in_hours_minutes": "In {hours} h {minutes} min",
			};
			let value = english[key] ?? key;
			if (vars) {
				value = value.replace(/\{(\w+)\}/g, (match, name: string) =>
					name in vars ? String(vars[name]) : match,
				);
			}
			return value;
		});
	if (minutes <= 0) {
		return tr("time.starting_now");
	}
	if (minutes < 60) {
		return tr("time.in_minutes", { count: minutes });
	}
	const hours = Math.floor(minutes / 60);
	const remaining = minutes % 60;
	if (remaining === 0) {
		return tr("time.in_hours", { count: hours });
	}
	return tr("time.in_hours_minutes", { hours, minutes: remaining });
}
