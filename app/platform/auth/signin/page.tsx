"use client";
import { useLocalization } from "@/lib/localization-context";
import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";

import { ADMIN_HOME, PARENT_HOME } from "@/components/dashboard/nav-items";
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
	signInSchema,
	type SignInValues,
} from "@/app/platform/lib/schemas/auth";
import { signIn } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useSession } from "@/lib/session-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { TokenResponse } from "@/lib/data-contracts";

export default function SignInPage() {
	const { t } = useLocalization();
	const router = useRouter();
	const { refreshSession } = useSession();
	const [formError, setFormError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInValues>({
		resolver: useZodResolver(signInSchema),
	});

	async function submitSignIn(values: SignInValues): Promise<TokenResponse> {
		try {
			return await signIn(values);
		} catch (err) {
			if (err instanceof ApiError) {
				throw err;
			}
			// The first cross-origin attempt can fail with a transient network/CORS
			// error (common when the backend is on localhost). Retry once.
			return await signIn(values);
		}
	}

	const onSubmit = async (values: SignInValues) => {
		setFormError(null);
		try {
			const response = await submitSignIn(values);
			await refreshSession();
			toast.success(t("auth.signed_in"));
			router.replace(response.role === "sheikh" ? ADMIN_HOME : PARENT_HOME);
		} catch (err) {
			if (err instanceof ApiError && err.status === 401) {
				setFormError(err.message);
			} else if (err instanceof ApiError) {
				toast.error(err.message);
			} else {
				toast.error(t("common.something_went_wrong"));
			}
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle>{t("auth.sign_in")}</CardTitle>
					<CardDescription>{t("auth.signin_desc")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						{formError ? <ErrorBanner message={formError} /> : null}
						<FieldInput
							label={t("auth.email_label")}
							type="email"
							placeholder={t("auth.email_placeholder")}
							required
							autoFocus
							error={errors.email?.message}
							{...register("email")}
						/>
						<FieldInput
							label={t("auth.password_label")}
							type="password"
							required
							error={errors.password?.message}
							{...register("password")}
						/>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? t("auth.submitting") : t("auth.sign_in")}
						</Button>
					</form>
					<div className="mt-6 flex flex-col items-center gap-2 border-t pt-4 text-sm">
						<Link
							href="/platform/auth/activate"
							className="text-primary hover:underline"
						>
							{t("auth.have_invite_code")}
						</Link>
						<Link
							href="/platform/auth/reset-request"
							className="text-primary hover:underline"
						>
							{t("auth.forgot_password")}
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
