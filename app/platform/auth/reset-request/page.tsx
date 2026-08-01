"use client";
import { useLocalization } from "@/lib/localization-context";
import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";

import { ErrorBanner } from "@/components/shared/error-banner";
import { FieldInput } from "@/components/shared/field-input";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	resetRequestSchema,
	type ResetRequestValues,
} from "@/app/platform/lib/schemas/auth";
import { requestPasswordReset } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetRequestPage() {
	const { t } = useLocalization();
	const [formError, setFormError] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ResetRequestValues>({
		resolver: useZodResolver(resetRequestSchema),
	});

	const onSubmit = async (values: ResetRequestValues) => {
		setFormError(null);
		try {
			await requestPasswordReset({ identifier: values.identifier });
			// The backend always returns 204; show the same message regardless
			// so the response does not leak which identifiers exist.
			setSubmitted(true);
		} catch (err) {
			if (err instanceof ApiError) {
				setFormError(err.message);
			} else {
				toast.error(t("common.something_went_wrong"));
			}
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{t("auth.reset_title")}</CardTitle>
					<CardDescription>{t("auth.reset_desc")}</CardDescription>
				</CardHeader>
				<CardContent>
					{submitted ? (
						<div className="flex flex-col items-center gap-3 py-4 text-center">
							<CheckCircle2 className="size-10 text-success" />
							<p className="text-sm">{t("auth.reset_sent")}</p>
							<Button variant="outline" asChild className="mt-2">
								<Link href="/platform/auth/signin">{t("auth.back_to_signin")}</Link>
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
							{formError ? <ErrorBanner message={formError} /> : null}
							<FieldInput
								label={t("auth.identifier_label")}
								placeholder={t("auth.identifier_placeholder")}
								required
								error={errors.identifier?.message}
								{...register("identifier")}
							/>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? t("auth.sending") : t("auth.send_reset")}
							</Button>
						</form>
					)}
					<div className="mt-6 flex flex-col items-center gap-2 border-t pt-4 text-sm">
						<Link href="/platform/auth/signin" className="text-primary hover:underline">{t("auth.back_to_signin")}</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
