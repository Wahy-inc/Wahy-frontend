"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Pencil, Plus, ScrollText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/shared/searchable-select";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { errorMessage } from "@/components/shared/error-text";
import { FieldInput } from "@/components/shared/field-input";
import { FieldTextarea } from "@/components/shared/field-textarea";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { WirdStatusBadge } from "@/components/shared/status-badge";
import {
	createWirdAssignment,
	listWirdAssignments,
	rejectWirdAssignment,
	updateWirdAssignment,
	verifyWirdAssignment,
} from "@/lib/api/wird";
import { listStudents } from "@/lib/api/students";
import { formatDate, formatDateTime } from "@/lib/dates";
import {
	wirdCreateSchema,
	wirdReviewSchema,
	wirdUpdateSchema,
	type WirdCreateValues,
	type WirdReviewValues,
	type WirdUpdateValues,
} from "@/app/platform/lib/schemas/wird";
import {
	WirdAssignmentStatus,
	type StudentRead,
	type WirdAssignmentRead,
} from "@/lib/data-contracts";

const STUDENTS_PAGE_SIZE = 100;

const STATUS_OPTIONS: { value: WirdAssignmentStatus; labelKey: string }[] = [
	{ value: WirdAssignmentStatus.Assigned, labelKey: "wird.assigned" },
	{
		value: WirdAssignmentStatus.CompletedByStudent,
		labelKey: "wird.completed",
	},
	{ value: WirdAssignmentStatus.VerifiedBySheikh, labelKey: "wird.verified" },
	{ value: WirdAssignmentStatus.NeedsRetry, labelKey: "wird.needs_retry" },
	{ value: WirdAssignmentStatus.Cancelled, labelKey: "wird.cancelled" },
];

function studentName(student: StudentRead): string {
	return student.full_name_english || student.full_name_arabic;
}

function surahRange(assignment: WirdAssignmentRead): string {
	if (
		!assignment.surah_name &&
		assignment.ayah_from === null &&
		assignment.ayah_to === null
	) {
		return "-";
	}
	const surah = assignment.surah_name ?? "Surah";
	if (assignment.ayah_from !== null || assignment.ayah_to !== null) {
		return `${surah}: ${assignment.ayah_from ?? "?"} - ${assignment.ayah_to ?? "?"}`;
	}
	return surah;
}

interface NewWirdDialogProps {
	students: StudentRead[];
	onClose: () => void;
	onSuccess: () => void;
}

function NewWirdDialog({ students, onClose, onSuccess }: NewWirdDialogProps) {
	const { t } = useLocalization();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<z.input<typeof wirdCreateSchema>, unknown, WirdCreateValues>({
		resolver: useZodResolver(wirdCreateSchema),
		defaultValues: {
			title: "",
			surah_name: "",
			ayah_from: null,
			ayah_to: null,
			due_date: "",
			notes: "",
		},
	});

	const createMutation = useMutation({
		mutationFn: (values: WirdCreateValues) =>
			createWirdAssignment({
				student_id: values.student_id,
				title: values.title,
				surah_name: values.surah_name || null,
				ayah_from: values.ayah_from ?? null,
				ayah_to: values.ayah_to ?? null,
				due_date: values.due_date || null,
				notes: values.notes || null,
			}),
		onSuccess: () => {
			toast.success(t("wird.created_success"));
			onSuccess();
			onClose();
		},
		onError: (err: unknown) => setError(errorMessage(err)),
	});

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className="max-h-[85vh] overflow-y-auto">
				<form
					onSubmit={handleSubmit((values) => createMutation.mutate(values))}
					className="flex flex-col gap-4"
				>
					<DialogHeader>
						<DialogTitle>{t("wird.new_assignment")}</DialogTitle>
						<DialogDescription>
							{t("wird.new_assignment_desc")}
						</DialogDescription>
					</DialogHeader>
					{error ? <ErrorBanner message={error} /> : null}
					<Controller
						control={control}
						name="student_id"
						render={({ field }) => (
							<div className="flex flex-col gap-1.5">
								<Label htmlFor="wird-student">
									{t("common.student")}
									<span className="text-destructive ms-0.5">*</span>
								</Label>
								<SearchableSelect
									value={
										field.value === undefined ? undefined : String(field.value)
									}
									onValueChange={field.onChange}
									options={students.map((student) => ({
										value: String(student.id),
										label: studentName(student),
									}))}
									placeholder={t("common.select_student")}
								/>
								{errors.student_id ? (
									<p className="text-destructive text-xs">
										{errors.student_id.message}
									</p>
								) : null}
							</div>
						)}
					/>
					<FieldInput
						label="Title"
						required
						error={errors.title?.message}
						{...register("title")}
					/>
					<FieldInput
						label={t("wird.surah_name")}
						error={errors.surah_name?.message}
						{...register("surah_name")}
					/>
					<div className="grid grid-cols-2 gap-3">
						<FieldInput
							label={t("lessons.ayah_from")}
							type="number"
							min={1}
							error={errors.ayah_from?.message}
							{...register("ayah_from", {
								setValueAs: (value) => (value === "" ? null : value),
							})}
						/>
						<FieldInput
							label={t("lessons.ayah_to")}
							type="number"
							min={1}
							error={errors.ayah_to?.message}
							{...register("ayah_to", {
								setValueAs: (value) => (value === "" ? null : value),
							})}
						/>
					</div>
					<FieldInput
						label="Due date"
						type="date"
						error={errors.due_date?.message}
						{...register("due_date")}
					/>
					<FieldTextarea
						label="Notes"
						placeholder={t("wird.instructions_placeholder")}
						error={errors.notes?.message}
						{...register("notes")}
					/>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending
								? t("common.creating")
								: t("wird.create")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface EditWirdDialogProps {
	assignment: WirdAssignmentRead;
	students: StudentRead[];
	onClose: () => void;
	onSuccess: () => void;
}

function EditWirdDialog({
	assignment,
	students,
	onClose,
	onSuccess,
}: EditWirdDialogProps) {
	const { t } = useLocalization();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.input<typeof wirdUpdateSchema>, unknown, WirdUpdateValues>({
		resolver: useZodResolver(wirdUpdateSchema),
		defaultValues: {
			title: assignment.title,
			surah_name: assignment.surah_name ?? "",
			ayah_from: assignment.ayah_from,
			ayah_to: assignment.ayah_to,
			due_date: assignment.due_date ?? "",
			notes: assignment.notes ?? "",
		},
	});

	const updateMutation = useMutation({
		mutationFn: (values: WirdUpdateValues) =>
			updateWirdAssignment(assignment.id, {
				title: values.title ?? null,
				surah_name: values.surah_name || null,
				ayah_from: values.ayah_from ?? null,
				ayah_to: values.ayah_to ?? null,
				due_date: values.due_date || null,
				notes: values.notes || null,
			}),
		onSuccess: () => {
			toast.success(t("wird.updated_success"));
			onSuccess();
			onClose();
		},
		onError: (err: unknown) => setError(errorMessage(err)),
	});

	const assignmentStudent = students.find(
		(student: StudentRead) => student.id === assignment.student_id,
	);

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className="max-h-[85vh] overflow-y-auto">
				<form
					onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
					className="flex flex-col gap-4"
				>
					<DialogHeader>
						<DialogTitle>{t("wird.edit_assignment")}</DialogTitle>
						<DialogDescription>{assignment.title}</DialogDescription>
					</DialogHeader>
					{error ? <ErrorBanner message={error} /> : null}
					<div className="flex flex-col gap-1.5">
						<Label>{t("common.student")}</Label>
						<p className="text-sm font-medium">
							{assignmentStudent
								? studentName(assignmentStudent)
								: `Student #${assignment.student_id}`}
						</p>
					</div>
					<FieldInput
						label="Title"
						required
						error={errors.title?.message}
						{...register("title")}
					/>
					<FieldInput
						label={t("wird.surah_name")}
						error={errors.surah_name?.message}
						{...register("surah_name")}
					/>
					<div className="grid grid-cols-2 gap-3">
						<FieldInput
							label={t("lessons.ayah_from")}
							type="number"
							min={1}
							error={errors.ayah_from?.message}
							{...register("ayah_from", {
								setValueAs: (value) => (value === "" ? null : value),
							})}
						/>
						<FieldInput
							label={t("lessons.ayah_to")}
							type="number"
							min={1}
							error={errors.ayah_to?.message}
							{...register("ayah_to", {
								setValueAs: (value) => (value === "" ? null : value),
							})}
						/>
					</div>
					<FieldInput
						label="Due date"
						type="date"
						error={errors.due_date?.message}
						{...register("due_date")}
					/>
					<FieldTextarea
						label="Notes"
						placeholder={t("wird.instructions_placeholder")}
						error={errors.notes?.message}
						{...register("notes")}
					/>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={updateMutation.isPending}>
							{updateMutation.isPending
								? t("common.saving")
								: t("common.save_changes")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface ReviewWirdDialogProps {
	assignment: WirdAssignmentRead;
	mode: "verify" | "reject";
	onClose: () => void;
	onSuccess: () => void;
}

function ReviewWirdDialog({
	assignment,
	mode,
	onClose,
	onSuccess,
}: ReviewWirdDialogProps) {
	const { t } = useLocalization();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<WirdReviewValues>({
		resolver: useZodResolver(wirdReviewSchema),
		defaultValues: { verification_notes: "" },
	});

	const reviewMutation = useMutation({
		mutationFn: (values: WirdReviewValues) => {
			const payload = { verification_notes: values.verification_notes || null };
			return mode === "verify"
				? verifyWirdAssignment(assignment.id, payload)
				: rejectWirdAssignment(assignment.id, payload);
		},
		onSuccess: () => {
			toast.success(
				mode === "verify"
					? t("wird.verified_success")
					: t("wird.rejected_success"),
			);
			onSuccess();
			onClose();
		},
		onError: (err: unknown) => setError(errorMessage(err)),
	});

	const isVerify = mode === "verify";

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent>
				<form
					onSubmit={handleSubmit((values) => reviewMutation.mutate(values))}
					className="flex flex-col gap-4"
				>
					<DialogHeader>
						<DialogTitle>
							{isVerify ? t("wird.verify_title") : t("wird.reject_title")}
						</DialogTitle>
						<DialogDescription>
							{isVerify ? t("wird.verify_desc") : t("wird.reject_desc")}
						</DialogDescription>
					</DialogHeader>
					{error ? <ErrorBanner message={error} /> : null}
					<FieldTextarea
						label={t("wird.verification_notes")}
						placeholder={t("wird.verification_notes_placeholder")}
						error={errors.verification_notes?.message}
						{...register("verification_notes")}
					/>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button
							type="submit"
							variant={isVerify ? "default" : "destructive"}
							disabled={reviewMutation.isPending}
						>
							{reviewMutation.isPending
								? t("common.saving")
								: isVerify
									? "Verify"
									: "Reject"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminWirdPage() {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [studentFilter, setStudentFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [createOpen, setCreateOpen] = useState(false);
	const [editing, setEditing] = useState<WirdAssignmentRead | null>(null);
	const [reviewing, setReviewing] = useState<{
		assignment: WirdAssignmentRead;
		mode: "verify" | "reject";
	} | null>(null);

	const studentsQuery = useQuery({
		queryKey: ["students"],
		queryFn: () => listStudents({ perPage: STUDENTS_PAGE_SIZE }),
	});

	const studentId = studentFilter === "all" ? undefined : Number(studentFilter);
	const status =
		statusFilter === "all" ? null : (statusFilter as WirdAssignmentStatus);

	const assignmentsQuery = useQuery({
		queryKey: ["wird", { studentId, status }],
		queryFn: () => listWirdAssignments({ studentId, status }),
	});

	const studentNameById = useMemo(() => {
		const map = new Map<number, string>();
		for (const student of studentsQuery.data?.items ?? []) {
			map.set(student.id, studentName(student));
		}
		return map;
	}, [studentsQuery.data]);

	const invalidateWird = () => {
		queryClient.invalidateQueries({ queryKey: ["wird"] });
	};

	const cancelMutation = useMutation({
		mutationFn: (assignmentId: number) =>
			updateWirdAssignment(assignmentId, {
				status: WirdAssignmentStatus.Cancelled,
			}),
		onSuccess: () => {
			toast.success(t("wird.cancelled_success"));
			invalidateWird();
		},
		onError: (err: unknown) => toast.error(errorMessage(err)),
	});

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("wird.title")}
				description={t("wird.description")}
				actions={
					<Button onClick={() => setCreateOpen(true)}>
						<Plus className="size-4" />
						{t("wird.new_assignment")}
					</Button>
				}
			/>

			<div className="flex flex-wrap items-end gap-3">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="wird-student-filter">{t("common.student")}</Label>
					<SearchableSelect
						value={studentFilter}
						onValueChange={setStudentFilter}
						options={[
							{ value: "all", label: "All students" },
							...(studentsQuery.data?.items.map((student: StudentRead) => ({
								value: String(student.id),
								label: studentName(student),
							})) ?? []),
						]}
						placeholder={t("wird.all_students")}
						className="w-56"
					/>
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor="wird-status-filter">{t("common.status")}</Label>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger id="wird-status-filter" className="w-48">
							<SelectValue placeholder={t("wird.all_statuses")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">{t("wird.all_statuses")}</SelectItem>
							{STATUS_OPTIONS.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{t(option.labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{assignmentsQuery.isLoading ? <LoadingSkeleton rows={6} /> : null}

			{assignmentsQuery.isError ? (
				<div className="flex flex-col items-start gap-3">
					<ErrorBanner message={errorMessage(assignmentsQuery.error)} />
					<Button
						variant="outline"
						onClick={() => void assignmentsQuery.refetch()}
					>
						{t("common.retry")}
					</Button>
				</div>
			) : null}

			{assignmentsQuery.isSuccess && assignmentsQuery.data.length === 0 ? (
				<EmptyState
					icon={ScrollText}
					title={t("wird.no_assignments")}
					description={t("wird.no_assignments_desc")}
				/>
			) : null}

			{assignmentsQuery.isSuccess && assignmentsQuery.data.length > 0 ? (
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t("wird.title_col")}</TableHead>
								<TableHead>{t("common.student")}</TableHead>
								<TableHead>{t("lessons.surah")}</TableHead>
								<TableHead>{t("wird.due_date")}</TableHead>
								<TableHead>{t("common.status")}</TableHead>
								<TableHead>{t("wird.verification")}</TableHead>
								<TableHead>{t("common.notes")}</TableHead>
								<TableHead className="text-end">
									{t("common.actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{assignmentsQuery.data.map((assignment: WirdAssignmentRead) => {
								const canCancel =
									assignment.status !== WirdAssignmentStatus.Cancelled &&
									assignment.status !== WirdAssignmentStatus.VerifiedBySheikh;
								return (
									<TableRow key={assignment.id}>
										<TableCell className="font-medium">
											{assignment.title}
										</TableCell>
										<TableCell>
											{studentNameById.get(assignment.student_id) ??
												`Student #${assignment.student_id}`}
										</TableCell>
										<TableCell>{surahRange(assignment)}</TableCell>
										<TableCell>{formatDate(assignment.due_date)}</TableCell>
										<TableCell>
											<WirdStatusBadge status={assignment.status} />
										</TableCell>
										<TableCell>
											{assignment.completed_at ? (
												<p className="text-xs">
													Completed {formatDateTime(assignment.completed_at)}
												</p>
											) : null}
											{assignment.verified_at ? (
												<p className="text-xs">
													Reviewed {formatDateTime(assignment.verified_at)}
												</p>
											) : null}
											{!assignment.completed_at && !assignment.verified_at ? (
												<span className="text-muted-foreground">-</span>
											) : null}
										</TableCell>
										<TableCell>
											{assignment.verification_notes ?? "-"}
										</TableCell>
										<TableCell className="text-end">
											<div className="flex items-center justify-end gap-1">
												<Button
													variant="ghost"
													size="icon-sm"
													aria-label={t("wird.edit_aria")}
													disabled={
														assignment.status === WirdAssignmentStatus.Cancelled
													}
													onClick={() => setEditing(assignment)}
												>
													<Pencil className="size-4" />
												</Button>
												{assignment.status ===
												WirdAssignmentStatus.CompletedByStudent ? (
													<>
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																setReviewing({
																	assignment,
																	mode: "verify",
																})
															}
														>
															{t("wird.verify")}
														</Button>
														<Button
															variant="outline"
															size="sm"
															onClick={() =>
																setReviewing({
																	assignment,
																	mode: "reject",
																})
															}
														>
															{t("wird.reject")}
														</Button>
													</>
												) : null}
												{canCancel ? (
													<ConfirmDialog
														title={t("wird.cancel_title")}
														description={`Cancel "${assignment.title}"?`}
														confirmLabel="Cancel assignment"
														destructive
														onConfirm={() =>
															cancelMutation.mutate(assignment.id)
														}
														trigger={
															<Button variant="ghost" size="sm">
																{t("common.cancel")}
															</Button>
														}
													/>
												) : null}
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			) : null}

			{createOpen ? (
				<NewWirdDialog
					students={studentsQuery.data?.items ?? []}
					onClose={() => setCreateOpen(false)}
					onSuccess={invalidateWird}
				/>
			) : null}

			{editing ? (
				<EditWirdDialog
					key={editing.id}
					assignment={editing}
					students={studentsQuery.data?.items ?? []}
					onClose={() => setEditing(null)}
					onSuccess={invalidateWird}
				/>
			) : null}

			{reviewing ? (
				<ReviewWirdDialog
					key={reviewing.assignment.id}
					assignment={reviewing.assignment}
					mode={reviewing.mode}
					onClose={() => setReviewing(null)}
					onSuccess={invalidateWird}
				/>
			) : null}
		</div>
	);
}
