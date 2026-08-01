"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import {
	parentCreateSchema,
	type ChildValues,
	type ParentCreateValues,
} from "@/app/platform/lib/schemas/parent";
import { CopyCodeDialog } from "@/components/shared/copy-code-dialog";
import { ErrorBanner } from "@/components/shared/error-banner";
import { FieldInput } from "@/components/shared/field-input";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ApiError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/dates";
import { createParent } from "@/lib/api/parents";
import type { ParentCreate } from "@/lib/data-contracts";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const emptyChild: ChildValues = {
	full_name_arabic: "",
	full_name_english: "",
	date_of_birth: "",
	timezone: "UTC",
	lessons_per_week: 2,
	base_rate: undefined,
};

export default function NewParentPage() {
	const { t } = useLocalization();
	const [formError, setFormError] = useState<string | null>(null);
	const [invite, setInvite] = useState<{
		code: string;
		expires_at: string;
	} | null>(null);

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.input<typeof parentCreateSchema>, unknown, ParentCreateValues>({
		resolver: useZodResolver(parentCreateSchema),
		defaultValues: {
			full_name: "",
			email: "",
			phone: "",
			private_notes: "",
			children: [{ ...emptyChild }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "children",
	});

	const onSubmit = async (values: ParentCreateValues) => {
		setFormError(null);
		const payload: ParentCreate = {
			full_name: values.full_name,
			email: values.email,
			phone: values.phone || null,
			private_notes: values.private_notes || null,
			children: values.children.map((child) => ({
				full_name_arabic: child.full_name_arabic,
				full_name_english: child.full_name_english,
				date_of_birth: child.date_of_birth || null,
				timezone: child.timezone,
				lessons_per_week: child.lessons_per_week,
				base_rate: child.base_rate ?? null,
			})),
		};
		try {
			const response = await createParent(payload);
			setInvite({
				code: response.invite_code,
				expires_at: response.invite_expires_at,
			});
			toast.success(t("parents.created_success"));
		} catch (err) {
			if (err instanceof ApiError) {
				setFormError(err.message);
			} else {
				toast.error(t("common.something_went_wrong"));
			}
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<Link
				href="/platform/dashboard/admin/parents"
				className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm"
			>
				<ChevronLeft className="rtl:rotate-180 size-4" />
				{t("parents.back")}
			</Link>
			<PageHeader
				title={t("parents.title_new")}
				description={t("parents.title_new_desc")}
			/>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
				{formError ? <ErrorBanner message={formError} /> : null}
				<Card>
					<CardHeader>
						<CardTitle>{t("parents.details")}</CardTitle>
						<CardDescription>{t("parents.details_desc")}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<FieldInput
								label={t("common.full_name")}
								required
								error={errors.full_name?.message}
								{...register("full_name")}
							/>
							<FieldInput
								label={t("common.email")}
								type="email"
								required
								error={errors.email?.message}
								{...register("email")}
							/>
						</div>
						<FieldInput
							label={t("common.phone")}
							error={errors.phone?.message}
							{...register("phone")}
						/>
						<FieldInput
							label={t("students.private_notes")}
							error={errors.private_notes?.message}
							{...register("private_notes")}
						/>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>{t("parents.children")}</CardTitle>
						<CardDescription>
							{t("parents.add_at_least_one_child")}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{fields.map((field, index) => (
							<div
								key={field.id}
								className="border-border flex flex-col gap-4 rounded-md border p-4"
							>
								<div className="flex items-center justify-between">
									<p className="text-sm font-medium">Child {index + 1}</p>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										disabled={fields.length === 1}
										onClick={() => remove(index)}
									>
										<Trash2 className="size-4" />
										{t("common.remove")}
									</Button>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<FieldInput
										label={t("students.name_arabic")}
										required
										error={errors.children?.[index]?.full_name_arabic?.message}
										{...register(`children.${index}.full_name_arabic`)}
									/>
									<FieldInput
										label={t("students.name_english")}
										required
										error={errors.children?.[index]?.full_name_english?.message}
										{...register(`children.${index}.full_name_english`)}
									/>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<FieldInput
										label={t("students.date_of_birth")}
										type="date"
										error={errors.children?.[index]?.date_of_birth?.message}
										{...register(`children.${index}.date_of_birth`)}
									/>
									<FieldInput
										label={t("students.timezone")}
										required
										error={errors.children?.[index]?.timezone?.message}
										{...register(`children.${index}.timezone`)}
									/>
								</div>
								<div className="grid gap-4 sm:grid-cols-2">
									<FieldInput
										label={t("students.lessons_per_week")}
										type="number"
										min={1}
										max={14}
										required
										error={errors.children?.[index]?.lessons_per_week?.message}
										{...register(`children.${index}.lessons_per_week`, {
											setValueAs: (value) => (value === "" ? undefined : value),
										})}
									/>
									<FieldInput
										label={t("students.base_rate")}
										type="number"
										min={0}
										step="0.01"
										error={errors.children?.[index]?.base_rate?.message}
										{...register(`children.${index}.base_rate`, {
											setValueAs: (value) => (value === "" ? undefined : value),
										})}
									/>
								</div>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							className="w-fit"
							onClick={() => append({ ...emptyChild })}
						>
							<Plus className="size-4" />
							{t("parents.add_child")}
						</Button>
					</CardContent>
				</Card>

				<div>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? t("common.creating") : t("parents.create")}
					</Button>
				</div>
			</form>

			<CopyCodeDialog
				open={invite !== null}
				onOpenChange={(open) => {
					if (!open) {
						setInvite(null);
					}
				}}
				title={t("parents.invite_code")}
				description={t("parents.invite_code_desc")}
				code={invite?.code ?? ""}
				expiresAt={invite ? formatDateTime(invite.expires_at) : undefined}
				expiresLabel={t("common.expires")}
			/>
		</div>
	);
}
