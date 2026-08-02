"use client";
import { useLocalization } from "@/lib/localization-context";
import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";

import {
	ADMIN_HOME,
	PARENT_HOME,
} from "@/components/dashboard/nav-items";
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
	activateSchema,
	type ActivateValues,
} from "@/app/platform/lib/schemas/auth";
import { activate } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useSession } from "@/lib/session-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ActivatePage() {
	const { t } = useLocalization();
	const router = useRouter();
	const { refreshSession } = useSession();
	const [formError, setFormError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ActivateValues>({
		resolver: useZodResolver(activateSchema),
	});

	const onSubmit = async (values: ActivateValues) => {
		setFormError(null);
		try {
			const response = await activate({
				code: values.code,
				new_password: values.new_password,
			});
			await refreshSession();
			toast.success(t("auth.activated_success"));
			router.replace(response.role === "sheikh" ? ADMIN_HOME : PARENT_HOME);
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
					<CardTitle>{t("auth.activate_title")}</CardTitle>
					<CardDescription>{t("auth.activate_desc")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
						{formError ? <ErrorBanner message={formError} /> : null}
						<FieldInput
							label={t("auth.code_label")}
							placeholder={t("auth.code_placeholder")}
							required
							error={errors.code?.message}
							{...register("code")}
						/>
						<FieldInput
							label={t("auth.new_password")}
							type="password"
							required
							error={errors.new_password?.message}
							{...register("new_password")}
						/>
						<FieldInput
							label={t("auth.confirm_password")}
							type="password"
							required
							error={errors.confirm_password?.message}
							{...register("confirm_password")}
						/>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? t("auth.activating") : t("auth.activate")}
						</Button>
					</form>
					<div className="mt-6 flex flex-col items-center gap-2 border-t pt-4 text-sm">
						<Link href="/platform/auth/signin" className="text-primary hover:underline">{t("auth.already_have_account")}</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
