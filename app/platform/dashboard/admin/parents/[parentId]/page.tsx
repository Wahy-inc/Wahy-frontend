"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import {
	childSchema,
	parentUpdateSchema,
	type ChildValues,
	type ParentUpdateValues,
} from "@/app/platform/lib/schemas/parent";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyCodeDialog } from "@/components/shared/copy-code-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { FieldInput } from "@/components/shared/field-input";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import {
	StatusBadge,
	StudentStatusBadge,
} from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	addChild,
	getParent,
	regenerateInvite,
	setParentActive,
	updateParent,
} from "@/lib/api/parents";
import { errorMessage } from "@/components/shared/error-text";
import { ApiError } from "@/lib/api/client";
import { formatDateTime } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import type {
	ChildCreate,
	ParentDetailRead,
	ParentUpdate,
	StudentRead,
	StudentStatus,
} from "@/lib/data-contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, KeyRound, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
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

interface EditParentDialogProps {
	parent: ParentDetailRead;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaved: () => void;
}

function EditParentDialog({
	parent,
	open,
	onOpenChange,
	onSaved,
}: EditParentDialogProps) {
	const { t } = useLocalization();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ParentUpdateValues>({
		resolver: useZodResolver(parentUpdateSchema),
		defaultValues: {
			full_name: parent.full_name,
			email: parent.email,
			phone: parent.phone ?? "",
			private_notes: parent.private_notes ?? "",
		},
	});

	const mutation = useMutation({
		mutationFn: (payload: ParentUpdate) => updateParent(parent.id, payload),
		onSuccess: () => {
			toast.success(t("parents.updated_success"));
			onSaved();
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	const onSubmit = (values: ParentUpdateValues) => {
		mutation.mutate({
			full_name: values.full_name,
			email: values.email,
			phone: values.phone || null,
			private_notes: values.private_notes || null,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("parents.edit_parent")}</DialogTitle>
					<DialogDescription>{t("parents.edit_parent_desc")}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<FieldInput
						label={t("common.full_name")}
						required
						error={errors.full_name?.message}
						{...register("full_name")}
					/>
					<FieldInput
						label="Email"
						type="email"
						required
						error={errors.email?.message}
						{...register("email")}
					/>
					<FieldInput
						label="Phone"
						error={errors.phone?.message}
						{...register("phone")}
					/>
					<FieldInput
						label="Private notes"
						error={errors.private_notes?.message}
						{...register("private_notes")}
					/>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? t("common.saving") : t("common.save")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface AddChildDialogProps {
	parentId: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaved: () => void;
}

function AddChildDialog({
	parentId,
	open,
	onOpenChange,
	onSaved,
}: AddChildDialogProps) {
	const { t } = useLocalization();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.input<typeof childSchema>, unknown, ChildValues>({
		resolver: useZodResolver(childSchema),
		defaultValues: { ...emptyChild },
	});

	const mutation = useMutation({
		mutationFn: (payload: ChildCreate) => addChild(parentId, payload),
		onSuccess: () => {
			toast.success(t("parents.child_added_success"));
			onSaved();
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	const onSubmit = (values: ChildValues) => {
		mutation.mutate({
			full_name_arabic: values.full_name_arabic,
			full_name_english: values.full_name_english,
			date_of_birth: values.date_of_birth || null,
			timezone: values.timezone,
			lessons_per_week: values.lessons_per_week,
			base_rate: values.base_rate ?? null,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("parents.add_child")}</DialogTitle>
					<DialogDescription>{t("parents.add_child_desc")}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<FieldInput
						label={t("students.name_arabic")}
						required
						error={errors.full_name_arabic?.message}
						{...register("full_name_arabic")}
					/>
					<FieldInput
						label={t("students.name_english")}
						required
						error={errors.full_name_english?.message}
						{...register("full_name_english")}
					/>
					<div className="grid gap-4 sm:grid-cols-2">
						<FieldInput
							label={t("students.date_of_birth")}
							type="date"
							error={errors.date_of_birth?.message}
							{...register("date_of_birth")}
						/>
						<FieldInput
							label={t("students.timezone")}
							required
							error={errors.timezone?.message}
							{...register("timezone")}
						/>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<FieldInput
							label={t("students.lessons_per_week")}
							type="number"
							min={1}
							max={14}
							required
							error={errors.lessons_per_week?.message}
							{...register("lessons_per_week", {
								setValueAs: (value) => (value === "" ? undefined : value),
							})}
						/>
						<FieldInput
							label="Base rate"
							type="number"
							min={0}
							step="0.01"
							error={errors.base_rate?.message}
							{...register("base_rate", {
								setValueAs: (value) => (value === "" ? undefined : value),
							})}
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? t("common.adding") : t("parents.add_child")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function ParentDetailPage() {
	const { t } = useLocalization();
	const params = useParams<{ parentId: string }>();
	const parentId = Number(params.parentId);
	const router = useRouter();
	const queryClient = useQueryClient();
	const [editOpen, setEditOpen] = useState(false);
	const [addChildOpen, setAddChildOpen] = useState(false);
	const [invite, setInvite] = useState<{
		code: string;
		expires_at: string;
	} | null>(null);

	const {
		data: parent,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["parents", parentId],
		queryFn: () => getParent(parentId),
		enabled: Number.isFinite(parentId),
	});

	const invalidateParent = useCallback(() => {
		void queryClient.invalidateQueries({ queryKey: ["parents", parentId] });
		void queryClient.invalidateQueries({ queryKey: ["parents"] });
	}, [queryClient, parentId]);

	const regenerateMutation = useMutation({
		mutationFn: () => regenerateInvite(parentId),
		onSuccess: (data: { code: string; expires_at: string }) => {
			setInvite({ code: data.code, expires_at: data.expires_at });
			toast.success(t("parents.invite_regenerated"));
		},
		onError: (err: unknown) => {
			toast.error(
				err instanceof ApiError && err.status === 409
					? err.message
					: t("parents.invite_regenerate_failed"),
			);
		},
	});

	const setActiveMutation = useMutation({
		mutationFn: (active: boolean) => setParentActive(parentId, active),
		onSuccess: (_data: unknown, active: boolean) => {
			invalidateParent();
			toast.success(
				active
					? t("parents.activated_success")
					: t("parents.deactivated_success"),
			);
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				<LoadingSkeleton rows={5} />
			</div>
		);
	}

	if (isError || !parent) {
		return (
			<div className="flex flex-col gap-6">
				<ErrorBanner message={errorMessage(error)} />
			</div>
		);
	}

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
				title={parent.full_name}
				description={parent.email}
				actions={
					<>
						<Button variant="outline" onClick={() => setEditOpen(true)}>
							<Pencil className="size-4" />
							{t("common.edit")}
						</Button>
						<Button
							variant="outline"
							disabled={regenerateMutation.isPending}
							onClick={() => regenerateMutation.mutate()}
						>
							<KeyRound className="size-4" />
							{t("parents.regenerate_invite")}
						</Button>
						{parent.is_active ? (
							<ConfirmDialog
								title={t("parents.deactivate_title")}
								description={t("parents.deactivate_desc")}
								confirmLabel={t("parents.deactivate")}
								destructive
								onConfirm={() => setActiveMutation.mutate(false)}
								trigger={
									<Button
										variant="outline"
										disabled={setActiveMutation.isPending}
									>
										{t("parents.deactivate")}
									</Button>
								}
							/>
						) : (
							<Button
								disabled={setActiveMutation.isPending}
								onClick={() => setActiveMutation.mutate(true)}
							>
								{t("parents.activate")}
							</Button>
						)}
						<Button onClick={() => setAddChildOpen(true)}>
							<Plus className="size-4" />
							{t("parents.add_child")}
						</Button>
					</>
				}
			/>

			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-1">
					<CardHeader>
						<CardTitle>{t("common.details")}</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-2 text-sm">
						<div className="flex items-center justify-between gap-3">
							<span className="text-muted-foreground">
								{t("common.status")}
							</span>
							{parent.is_active ? (
								<StatusBadge variant="success">
									{t("schedules.active")}
								</StatusBadge>
							) : (
								<StatusBadge variant="outline">
									{t("parents.not_activated")}
								</StatusBadge>
							)}
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-muted-foreground">{t("common.email")}</span>
							<span className="truncate">{parent.email}</span>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-muted-foreground">{t("common.phone")}</span>
							<span>{parent.phone ?? "—"}</span>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-muted-foreground">
								{t("parents.children")}
							</span>
							<span>{parent.children.length}</span>
						</div>
						{parent.private_notes ? (
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground">
									{t("students.private_notes")}
								</span>
								<span>{parent.private_notes}</span>
							</div>
						) : null}
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>{t("parents.children")}</CardTitle>
						<CardDescription>{t("parents.children_desc")}</CardDescription>
					</CardHeader>
					<CardContent>
						{parent.children.length === 0 ? (
							<EmptyState
								title={t("parents.no_children")}
								description={t("parents.no_children_desc")}
							/>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t("common.name")}</TableHead>
										<TableHead>{t("common.status")}</TableHead>
										<TableHead>{t("students.base_rate")}</TableHead>
										<TableHead>{t("common.notes")}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{parent.children.map((child: StudentRead) => (
										<TableRow
											key={child.id}
											className="cursor-pointer"
											onClick={() =>
												router.push(
													`/platform/dashboard/admin/students/${child.id}`,
												)
											}
										>
											<TableCell>
												<p className="font-medium">{child.full_name_english}</p>
												<p className="text-muted-foreground text-sm" dir="rtl">
													{child.full_name_arabic}
												</p>
											</TableCell>
											<TableCell>
												<StudentStatusBadge
													status={child.status as StudentStatus}
												/>
											</TableCell>
											<TableCell>{formatCurrency(child.base_rate)}</TableCell>
											<TableCell>
												{child.private_notes ?? child.special_notes ?? "—"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</CardContent>
				</Card>
			</div>

			{editOpen && parent ? (
				<EditParentDialog
					parent={parent}
					open={editOpen}
					onOpenChange={setEditOpen}
					onSaved={() => {
						invalidateParent();
						setEditOpen(false);
					}}
				/>
			) : null}
			{addChildOpen && parent ? (
				<AddChildDialog
					parentId={parent.id}
					open={addChildOpen}
					onOpenChange={setAddChildOpen}
					onSaved={() => {
						invalidateParent();
						setAddChildOpen(false);
					}}
				/>
			) : null}
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
