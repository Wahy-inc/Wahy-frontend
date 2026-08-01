"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalization } from "@/lib/localization-context";
import type { FieldValues } from "react-hook-form";
import type { ZodType } from "zod";

/**
 * Extra fields carried by zod v4 raw issues (the resolver types only expose
 * `code`/`message`/`path`, but the runtime issues include the v4-specific
 * fields we map on). All fields except `code` are optional because v4 raw
 * issues only guarantee `code`.
 */
interface ZodValidationIssue {
	code: string;
	format?: string;
	minimum?: number | bigint;
	maximum?: number | bigint;
	origin?: string;
	expected?: string;
	input?: unknown;
	values?: unknown[];
}

/**
 * zodResolver with an errorMap that emits translated messages via the active
 * locale's `t`. Custom messages set on individual checks (e.g. `.refine(...,
 * { message })` or `.positive("Select a student")`) are left untouched: zod v4
 * only consults the error callback when the check has no explicit message.
 *
 * NOTE: with @hookform/resolvers v5 + zod v4, the error callback must be passed
 * as the SECOND argument (`{ error }`, zod v4 parse params) - not as resolver
 * options - because the resolver forwards that argument straight to
 * `schema.parse(data, params)`.
 */
export function useZodResolver<T extends ZodType<unknown, FieldValues>>(
	schema: T,
) {
	const { t } = useLocalization();

	const errorMap = (issue: ZodValidationIssue) => {
		const code = issue.code;

		if (code === "too_small") {
			const isLength = issue.origin === "string" || issue.origin === "array";
			if (isLength && issue.minimum === 1) {
				return { message: t("validation.required") };
			}
			return {
				message: t("validation.too_small", {
					min: Number(issue.minimum ?? 0),
				}),
			};
		}

		if (code === "too_big") {
			const isLength = issue.origin === "string" || issue.origin === "array";
			return {
				message: t(isLength ? "validation.too_long" : "validation.too_big", {
					max: Number(issue.maximum ?? 0),
				}),
			};
		}

		// zod v4 replaced `invalid_string` with `invalid_format`; the format
		// identifier lives on `issue.format` (email/date/url/...).
		if (code === "invalid_format") {
			if (issue.format === "email") {
				return { message: t("validation.invalid_email") };
			}
			if (issue.format === "date") {
				return { message: t("validation.invalid_date") };
			}
			if (issue.format === "url") {
				return { message: t("validation.invalid_url") };
			}
			return { message: t("validation.invalid_value") };
		}

		// zod v4 uses `invalid_value` for both enum and literal mismatches
		// (it replaced `invalid_enum_value` and `invalid_literal`).
		if (code === "invalid_value") {
			return { message: t("validation.invalid_enum") };
		}

		if (code === "invalid_type") {
			const expected = issue.expected;
			const received = issue.input;
			if (
				(expected === "string" ||
					expected === "number" ||
					expected === "array") &&
				(received === null || received === undefined)
			) {
				return { message: t("validation.required") };
			}
			return { message: t("validation.invalid_value") };
		}

		// `custom` and any other code keep the original (possibly custom)
		// message - returning undefined lets zod fall back to it.
		return undefined;
	};

	return zodResolver(schema, { error: errorMap });
}
