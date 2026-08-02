"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import { lessonCreateSchema } from "@/app/platform/lib/schemas/lesson";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { errorMessage } from "@/components/shared/error-text";
import { FieldInput } from "@/components/shared/field-input";
import { FieldTextarea } from "@/components/shared/field-textarea";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { AttendanceBadge } from "@/components/shared/status-badge";
import { ApiError } from "@/lib/api/client";
import { uploadClassFile } from "@/lib/api/classFiles";
import { createLessons, listLessons } from "@/lib/api/lessons";
import { listSchedules } from "@/lib/api/schedules";
import { listStudents } from "@/lib/api/students";
import { AttendanceStatus, type LessonCreate } from "@/lib/data-contracts";
import { formatDate, formatTime, todayISO } from "@/lib/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

const ATTENDANCE_OPTIONS: AttendanceStatus[] = [
	AttendanceStatus.Present,
	AttendanceStatus.Absent,
	AttendanceStatus.Late,
	AttendanceStatus.Excused,
];

type LessonFormValues = {
	student_id: number;
	schedule_id: number;
	date: string;
	attendance: AttendanceStatus;
	student_notes: string;
	sheikh_notes: string;
	what_is_heard_from_sheikh: string;
	homework: string;
};

const defaultValues: LessonFormValues = {
	student_id: 0,
	schedule_id: 0,
	date: todayISO(),
	attendance: AttendanceStatus.Present,
	student_notes: "",
	sheikh_notes: "",
	what_is_heard_from_sheikh: "",
	homework: "",
};

export default function AdminLessonsPage() {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [file, setFile] = useState<File | null>(null);

	const form = useForm<LessonFormValues>({
		resolver: useZodResolver(lessonCreateSchema) as Resolver<LessonFormValues>,
		defaultValues,
	});
	const watchedStudentId = form.watch("student_id");

	const studentsQuery = useQuery({
		queryKey: ["students"],
		queryFn: () => listStudents({ perPage: 100 }),
	});
	const students = studentsQuery.data?.items ?? [];

	const schedulesQuery = useQuery({
		queryKey: ["schedules", { page: 1, perPage: 100 }],
		queryFn: () => listSchedules({ page: 1, perPage: 100 }),
	});
	const schedules = schedulesQuery.data?.items ?? [];
	const availableSchedules = useMemo(
		() =>
			(schedulesQuery.data?.items ?? []).filter(
				(schedule) => schedule.student_id === watchedStudentId,
			),
		[schedulesQuery.data, watchedStudentId],
	);

	const studentName = (studentId: number) =>
		students.find((student) => student.id === studentId)?.full_name_english ??
		`Student #${studentId}`;
	const scheduleLabel = (scheduleId: number) => {
		const schedule = schedules.find((item) => item.id === scheduleId);
		return schedule
			? `${schedule.day_label} - ${formatTime(schedule.start_time)}`
			: `Schedule #${scheduleId}`;
	};

	const createMutation = useMutation({
		mutationFn: (payload: LessonCreate) => createLessons(payload),
		onSuccess: async (_, payload) => {
			queryClient.invalidateQueries({ queryKey: ["lessons"] });
			queryClient.invalidateQueries({ queryKey: ["classes"] });
			queryClient.invalidateQueries({ queryKey: ["calendar-grid"] });
			toast.success(t("lessons.create_success"));
			form.reset(defaultValues);
			if (file && payload.schedule_id > 0) {
				try {
					await uploadClassFile(payload.schedule_id, file);
					queryClient.invalidateQueries({
						queryKey: ["class-files", payload.schedule_id],
					});
					toast.success(t("file_upload.uploaded"));
				} catch (err) {
					toast.error(errorMessage(err));
				}
			}
			setFile(null);
		},
		onError: (err) =>
			toast.error(
				err instanceof ApiError
					? err.message
					: t("common.something_went_wrong"),
			),
	});

	const recentQuery = useQuery({
		queryKey: ["lessons", { page: 1, perPage: 10 }],
		queryFn: () => listLessons({ page: 1, perPage: 10 }),
	});
	const recentLessons = recentQuery.data?.items ?? [];

	const onSubmit = (values: LessonFormValues) => {
		createMutation.mutate({
			student_id: values.student_id,
			schedule_id: values.schedule_id,
			date: values.date,
			attendance: values.attendance,
			student_notes: values.student_notes || null,
			sheikh_notes: values.sheikh_notes || null,
			what_is_heard_from_sheikh: values.what_is_heard_from_sheikh || null,
			homework: values.homework || null,
		});
	};

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("lessons.manage_title")}
				description={t("lessons.manage_desc")}
			/>
			<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>{t("lessons.record")}</CardTitle>
						<CardDescription>{t("lessons.record_desc")}</CardDescription>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-4"
						>
							<Controller
								control={form.control}
								name="student_id"
								render={({ field, fieldState }) => (
									<div className="flex flex-col gap-1.5">
										<Label>{t("common.student")}</Label>
										<SearchableSelect
											value={field.value ? String(field.value) : ""}
											onValueChange={(value) => {
												form.setValue("student_id", Number(value));
												form.setValue("schedule_id", 0, {
													shouldValidate: true,
												});
											}}
											options={students.map((student) => ({
												value: String(student.id),
												label: student.full_name_english,
											}))}
											placeholder={t("common.select_student")}
										/>
										{fieldState.error ? (
											<p className="text-destructive text-xs">
												{fieldState.error.message}
											</p>
										) : null}
									</div>
								)}
							/>
							<Controller
								control={form.control}
								name="schedule_id"
								render={({ field, fieldState }) => (
									<div className="flex flex-col gap-1.5">
										<Label>{t("lessons.class")}</Label>
										<Select
											value={field.value ? String(field.value) : ""}
											onValueChange={(value) => field.onChange(Number(value))}
											disabled={availableSchedules.length === 0}
										>
											<SelectTrigger
												className="w-full"
												aria-invalid={fieldState.error ? true : undefined}
											>
												<SelectValue
													placeholder={
														watchedStudentId
															? t("lessons.no_schedules")
															: t("lessons.select_student_first")
													}
												/>
											</SelectTrigger>
											<SelectContent>
												{availableSchedules.map((schedule) => (
													<SelectItem
														key={schedule.id}
														value={String(schedule.id)}
													>
														{scheduleLabel(schedule.id)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.error ? (
											<p className="text-destructive text-xs">
												{fieldState.error.message}
											</p>
										) : null}
									</div>
								)}
							/>
							<div className="grid gap-4 sm:grid-cols-2">
								<FieldInput
									label={t("lessons.date")}
									type="date"
									required
									{...form.register("date")}
									error={form.formState.errors.date?.message}
								/>
								<Controller
									control={form.control}
									name="attendance"
									render={({ field }) => (
										<div className="flex flex-col gap-1.5">
											<Label>{t("lessons.attendance")}</Label>
											<Select
												value={field.value}
												onValueChange={(value) =>
													field.onChange(value as AttendanceStatus)
												}
											>
												<SelectTrigger className="w-full">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{ATTENDANCE_OPTIONS.map((status) => (
														<SelectItem key={status} value={status}>
															{status}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									)}
								/>
							</div>
							<FieldTextarea
								label="Student notes"
								{...form.register("student_notes")}
								placeholder={t("lessons.feedback_placeholder")}
							/>
							<FieldTextarea
								label="Sheikh notes"
								{...form.register("sheikh_notes")}
								placeholder={t("lessons.internal_notes")}
							/>
							<FieldTextarea
								label={t("lessons.what_heard")}
								{...form.register("what_is_heard_from_sheikh")}
							/>
							<FieldTextarea
								label="Homework"
								{...form.register("homework")}
								placeholder={t("lessons.assignment_placeholder")}
							/>
							<div className="flex flex-col gap-1.5">
								<Label>{t("lessons.attach_file")}</Label>
								<Input
									type="file"
									onChange={(event) => {
										setFile(event.target.files?.[0] ?? null);
									}}
								/>
							</div>
							<Button type="submit" disabled={createMutation.isPending}>
								{createMutation.isPending
									? t("lessons.recording")
									: t("lessons.record_button")}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ScrollText className="size-4" />
							{t("lessons.recent")}
						</CardTitle>
						<CardDescription>{t("lessons.recent_desc")}</CardDescription>
					</CardHeader>
					<CardContent>
						{recentQuery.error ? (
							<ErrorBanner
								message={
									recentQuery.error instanceof Error
										? recentQuery.error.message
										: t("common.something_went_wrong")
								}
							/>
						) : null}
						{recentQuery.isLoading ? (
							<LoadingSkeleton rows={5} />
						) : recentLessons.length === 0 ? (
							<EmptyState
								icon={ScrollText}
								title={t("lessons.no_lessons_recorded")}
								description={t("lessons.no_lessons_recorded_desc")}
							/>
						) : (
							<div className="overflow-hidden rounded-lg border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>{t("common.date")}</TableHead>
											<TableHead>{t("common.time")}</TableHead>
											<TableHead>{t("common.student")}</TableHead>
											<TableHead>{t("lessons.class")}</TableHead>
											<TableHead>{t("lessons.heard")}</TableHead>
											<TableHead>{t("lessons.homework")}</TableHead>
											<TableHead>{t("lessons.attendance")}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{recentLessons.map((lesson) => (
											<TableRow key={lesson.id}>
												<TableCell>{formatDate(lesson.date)}</TableCell>
												<TableCell>
													{formatTime(lesson.start_time)} -{" "}
													{formatTime(lesson.end_time)}
												</TableCell>
												<TableCell>{studentName(lesson.student_id)}</TableCell>
												<TableCell>
													{scheduleLabel(lesson.schedule_id)}
												</TableCell>
												<TableCell>
													{lesson.what_is_heard_from_sheikh ? (
														<span className="line-clamp-1 max-w-40">
															{lesson.what_is_heard_from_sheikh}
														</span>
													) : (
														<span className="text-muted-foreground">-</span>
													)}
												</TableCell>
												<TableCell>
													{lesson.homework ? (
														<span className="line-clamp-1 max-w-40">
															{lesson.homework}
														</span>
													) : (
														<span className="text-muted-foreground">-</span>
													)}
												</TableCell>
												<TableCell>
													<AttendanceBadge status={lesson.attendance} />
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
