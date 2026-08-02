"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import {
	studentUpdateSchema,
	type StudentUpdateValues,
} from "@/app/platform/lib/schemas/student";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { ErrorBanner } from "@/components/shared/error-banner";
import { FieldInput } from "@/components/shared/field-input";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StudentStatusBadge } from "@/components/shared/status-badge";
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { errorMessage } from "@/components/shared/error-text";
import {
	getStudent,
	getStudentAttendanceHours,
	updateStudent,
} from "@/lib/api/students";
import { formatDate, monthStartISO, todayISO } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import {
	StudentStatus,
	type StudentRead,
	type StudentUpdate,
} from "@/lib/data-contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const statusOptions: { value: StudentStatus; labelKey: string }[] = [
	{ value: StudentStatus.Active, labelKey: "schedules.active" },
	{ value: StudentStatus.OnHold, labelKey: "students.status_on_hold" },
	{ value: StudentStatus.Graduated, labelKey: "students.status_graduated" },
	{ value: StudentStatus.Inactive, labelKey: "schedules.inactive" },
];

interface EditStudentDialogProps {
	student: StudentRead;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSaved: () => void;
}

function EditStudentDialog({
	student,
	open,
	onOpenChange,
	onSaved,
}: EditStudentDialogProps) {
	const { t } = useLocalization();
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof studentUpdateSchema>,
		unknown,
		StudentUpdateValues
	>({
		resolver: useZodResolver(studentUpdateSchema),
		defaultValues: {
			full_name_arabic: student.full_name_arabic,
			full_name_english: student.full_name_english,
			date_of_birth: student.date_of_birth ?? "",
			timezone: student.timezone,
			status: student.status as StudentUpdateValues["status"],
			lessons_per_week: student.lessons_per_week,
			base_rate: student.base_rate ?? undefined,
			private_notes: student.private_notes ?? "",
			special_notes: student.special_notes ?? "",
		},
	});

	const statusValue = watch("status");

	const mutation = useMutation({
		mutationFn: (payload: StudentUpdate) => updateStudent(student.id, payload),
		onSuccess: () => {
			toast.success(t("students.update_success"));
			onSaved();
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	const onSubmit = (values: StudentUpdateValues) => {
		mutation.mutate({
			full_name_arabic: values.full_name_arabic,
			full_name_english: values.full_name_english,
			date_of_birth: values.date_of_birth || null,
			timezone: values.timezone,
			status: values.status as StudentStatus,
			lessons_per_week: values.lessons_per_week,
			base_rate: values.base_rate ?? null,
			private_notes: values.private_notes || null,
			special_notes: values.special_notes || null,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{t("students.edit")}</DialogTitle>
					<DialogDescription>{t("students.edit_desc")}</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<FieldInput
							label="Arabic name"
							required
							error={errors.full_name_arabic?.message}
							{...register("full_name_arabic")}
						/>
						<FieldInput
							label="English name"
							required
							error={errors.full_name_english?.message}
							{...register("full_name_english")}
						/>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<FieldInput
							label="Date of birth"
							type="date"
							error={errors.date_of_birth?.message}
							{...register("date_of_birth")}
						/>
						<FieldInput
							label="Timezone"
							required
							error={errors.timezone?.message}
							{...register("timezone")}
						/>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="student-status">{t("students.status")}</Label>
							<Select
								value={statusValue}
								onValueChange={(value) =>
									setValue("status", value as StudentUpdateValues["status"], {
										shouldValidate: true,
									})
								}
							>
								<SelectTrigger id="student-status" className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{statusOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{t(option.labelKey)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<FieldInput
							label="Lessons per week"
							type="number"
							min={1}
							max={14}
							required
							error={errors.lessons_per_week?.message}
							{...register("lessons_per_week", {
								setValueAs: (value) => (value === "" ? undefined : value),
							})}
						/>
					</div>
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
					<FieldInput
						label="Private notes"
						error={errors.private_notes?.message}
						{...register("private_notes")}
					/>
					<FieldInput
						label="Special notes"
						error={errors.special_notes?.message}
						{...register("special_notes")}
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
							{isSubmitting ? "Saving..." : "Save"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function StudentDetailPage() {
	const { t } = useLocalization();
	const params = useParams<{ studentId: string }>();
	const studentId = Number(params.studentId);
	const queryClient = useQueryClient();
	const [editOpen, setEditOpen] = useState(false);
	const [startDate, setStartDate] = useState(() => monthStartISO());
	const [endDate, setEndDate] = useState(() => todayISO());

	const {
		data: student,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["students", studentId],
		queryFn: () => getStudent(studentId),
		enabled: Number.isFinite(studentId),
	});

	const {
		data: attendance,
		isLoading: attendanceLoading,
		isError: attendanceError,
	} = useQuery({
		queryKey: ["students", studentId, "attendance", startDate, endDate],
		queryFn: () => getStudentAttendanceHours(studentId, { startDate, endDate }),
		enabled: Number.isFinite(studentId),
	});

	if (isLoading) {
		return (
			<div className="flex flex-col gap-6">
				<LoadingSkeleton rows={5} />
			</div>
		);
	}

	if (isError || !student) {
		return (
			<div className="flex flex-col gap-6">
				<ErrorBanner message={errorMessage(error)} />
			</div>
		);
	}

	const attendanceCards = [
		{
			label: t("analytics.hours_per_month"),
			value: attendance?.hours_per_month,
		},
		{ label: t("analytics.hours_attended"), value: attendance?.hours_attended },
		{ label: t("analytics.absent_hours"), value: attendance?.absent_hours },
		{
			label: t("analytics.remaining_hours"),
			value: attendance?.remaining_hours,
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<Link
				href="/platform/dashboard/admin/students"
				className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm"
			>
				<ChevronLeft className="rtl:rotate-180 size-4" />
				{t("students.back")}
			</Link>
			<PageHeader
				title={student.full_name_english}
				description={`${student.full_name_arabic} - ${student.timezone}`}
				actions={
					<Button variant="outline" onClick={() => setEditOpen(true)}>
						<Pencil className="size-4" />
						{t("common.edit")}
					</Button>
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
								{t("students.status")}
							</span>
							<StudentStatusBadge status={student.status} />
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-muted-foreground">
								{t("students.date_of_birth")}
							</span>
							<span>
								{formatDate(student.date_of_birth) || t("common.not_set")}
							</span>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-muted-foreground">
								{t("students.lessons_per_week")}
							</span>
							<span>{student.lessons_per_week}</span>
						</div>
						<div className="flex items-center justify-between gap-3">
							<span className="text-muted-foreground">
								{t("students.base_rate")}
							</span>
							<span>
								{formatCurrency(student.base_rate) || t("common.not_set")}
							</span>
						</div>
						{student.private_notes ? (
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground">
									{t("students.private_notes")}
								</span>
								<span>{student.private_notes}</span>
							</div>
						) : null}
						{student.special_notes ? (
							<div className="flex flex-col gap-1">
								<span className="text-muted-foreground">
									{t("students.special_notes")}
								</span>
								<span>{student.special_notes}</span>
							</div>
						) : null}
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>{t("students.attendance_hours")}</CardTitle>
						<CardDescription>{t("students.attendance_desc")}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-6">
						<DateRangePicker
							startName="start-date"
							endName="end-date"
							startLabel={t("common.from")}
							endLabel="To"
							startValue={startDate}
							endValue={endDate}
							onChange={(start, end) => {
								setStartDate(start);
								setEndDate(end);
							}}
						/>
						{attendanceLoading ? <LoadingSkeleton rows={2} /> : null}
						{attendanceError ? (
							<ErrorBanner
								message={t("error_messages.failed_load_attendance_hours")}
							/>
						) : null}
						{attendance ? (
							<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
								{attendanceCards.map((card) => (
									<Card key={card.label} className="py-4">
										<CardHeader>
											<CardTitle className="text-3xl font-semibold">
												{(card.value ?? 0).toFixed(1)}
											</CardTitle>
											<CardDescription>{card.label}</CardDescription>
										</CardHeader>
									</Card>
								))}
							</div>
						) : null}
					</CardContent>
				</Card>
			</div>

			{editOpen && student ? (
				<EditStudentDialog
					student={student}
					open={editOpen}
					onOpenChange={setEditOpen}
					onSaved={() => {
						void queryClient.invalidateQueries({
							queryKey: ["students", studentId],
						});
						void queryClient.invalidateQueries({ queryKey: ["students"] });
						setEditOpen(false);
					}}
				/>
			) : null}
		</div>
	);
}
