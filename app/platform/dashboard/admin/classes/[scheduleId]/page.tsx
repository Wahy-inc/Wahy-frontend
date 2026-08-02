"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import {
	lessonUpdateSchema,
	rescheduleSchema,
} from "@/app/platform/lib/schemas/lesson";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ClassFilesSection } from "@/components/shared/class-files-section";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { FieldInput } from "@/components/shared/field-input";
import { FieldTextarea } from "@/components/shared/field-textarea";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { AttendanceBadge } from "@/components/shared/status-badge";
import { ApiError } from "@/lib/api/client";
import { getClassAttendance, getClassHistory } from "@/lib/api/classes";
import { rescheduleLesson, updateLesson } from "@/lib/api/lessons";
import { listSchedules } from "@/lib/api/schedules";
import { listStudents } from "@/lib/api/students";
import {
	AttendanceStatus,
	RescheduleResponse,
	ScheduleRead,
	StudentRead,
	type ConflictItem,
	type LessonRead,
	type LessonUpdate,
	type RescheduleRequest,
	type SlotSuggestion,
} from "@/lib/data-contracts";
import {
	formatDate,
	formatDateTime,
	formatTime,
	monthStartISO,
	todayISO,
} from "@/lib/dates";
import { formatPercent } from "@/lib/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";

const ATTENDANCE_OPTIONS: AttendanceStatus[] = [
	AttendanceStatus.Present,
	AttendanceStatus.Absent,
	AttendanceStatus.Late,
	AttendanceStatus.Excused,
];
const HISTORY_LIMIT = 20;

/** ISO datetime -> value for a datetime-local input. */
function toDateTimeLocal(iso: string): string {
	return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
}

/** datetime-local input value -> ISO datetime string. */
function fromDateTimeLocal(value: string): string {
	return new Date(value).toISOString();
}

/** Pull conflicts and suggested slots out of a reschedule error/response payload. */
function extractReschedulePayload(err: unknown): {
	conflicts?: ConflictItem[];
	suggestedSlots?: SlotSuggestion[];
} | null {
	if (!(err instanceof ApiError)) {
		return null;
	}
	const detail = err.detail;
	if (!detail || typeof detail !== "object") {
		return null;
	}
	const record = detail as Record<string, unknown>;
	const conflicts = Array.isArray(record.conflicts)
		? (record.conflicts as ConflictItem[])
		: undefined;
	const suggestedSlots = Array.isArray(record.suggested_slots)
		? (record.suggested_slots as SlotSuggestion[])
		: undefined;
	if (conflicts || suggestedSlots) {
		return { conflicts, suggestedSlots };
	}
	return null;
}

interface LessonEditDialogProps {
	lesson: LessonRead;
	onClose: () => void;
}

type LessonEditFormValues = {
	attendance: AttendanceStatus | null;
	student_notes: string;
	sheikh_notes: string;
	what_is_heard_from_sheikh: string;
	homework: string;
};

function LessonEditDialog({ lesson, onClose }: LessonEditDialogProps) {
	const { t } = useLocalization();
	const queryClient = useQueryClient();

	const form = useForm<LessonEditFormValues>({
		resolver: useZodResolver(
			lessonUpdateSchema,
		) as Resolver<LessonEditFormValues>,
		defaultValues: {
			attendance: lesson.attendance ?? null,
			student_notes: lesson.student_notes ?? "",
			sheikh_notes: lesson.sheikh_notes ?? "",
			what_is_heard_from_sheikh: lesson.what_is_heard_from_sheikh ?? "",
			homework: lesson.homework ?? "",
		},
	});

	const mutation = useMutation({
		mutationFn: (payload: LessonUpdate) => updateLesson(lesson.id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["lessons"] });
			queryClient.invalidateQueries({ queryKey: ["calendar-grid"] });
			queryClient.invalidateQueries({ queryKey: ["classes"] });
			toast.success(t("lessons.update_success"));
			onClose();
		},
		onError: (err: unknown) =>
			toast.error(
				err instanceof ApiError
					? err.message
					: t("common.something_went_wrong"),
			),
	});

	const onSubmit = (values: LessonEditFormValues) => {
		mutation.mutate({
			attendance: values.attendance ?? undefined,
			student_notes: values.student_notes || null,
			sheikh_notes: values.sheikh_notes || null,
			what_is_heard_from_sheikh: values.what_is_heard_from_sheikh || null,
			homework: values.homework || null,
		});
	};

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit lesson</DialogTitle>
					<DialogDescription>
						{formatDate(lesson.date)} - {formatTime(lesson.start_time)} to{" "}
						{formatTime(lesson.end_time)}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<Controller
						control={form.control}
						name="attendance"
						render={({ field }) => (
							<div className="flex flex-col gap-1.5">
								<Label>{t("lessons.attendance")}</Label>
								<Select
									value={field.value ?? ""}
									onValueChange={(value) =>
										field.onChange(value as AttendanceStatus)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Not set" />
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
					<FieldTextarea
						label="Student notes"
						autoFocus
						{...form.register("student_notes")}
					/>
					<FieldTextarea
						label="Sheikh notes"
						{...form.register("sheikh_notes")}
					/>
					<FieldTextarea
						label={t("lessons.what_heard")}
						{...form.register("what_is_heard_from_sheikh")}
					/>
					<FieldTextarea label="Homework" {...form.register("homework")} />
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={mutation.isPending}
						>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={mutation.isPending}>
							{t("common.save")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface RescheduleDialogProps {
	lesson: LessonRead;
	onClose: () => void;
}

type RescheduleFormValues = {
	new_start: string;
	new_end: string;
	scope: "this_only" | "this_and_future";
};

function RescheduleDialog({ lesson, onClose }: RescheduleDialogProps) {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [conflictData, setConflictData] = useState<{
		conflicts: ConflictItem[];
		suggested: SlotSuggestion[];
		message: string;
	} | null>(null);

	const form = useForm<RescheduleFormValues>({
		resolver: useZodResolver(
			rescheduleSchema,
		) as Resolver<RescheduleFormValues>,
		defaultValues: {
			new_start: toDateTimeLocal(`${lesson.date}T${lesson.start_time}Z`),
			new_end: toDateTimeLocal(`${lesson.date}T${lesson.end_time}Z`),
			scope: "this_only",
		},
	});

	const mutation = useMutation({
		mutationFn: (payload: RescheduleRequest) =>
			rescheduleLesson(lesson.id, payload),
		onSuccess: (data: RescheduleResponse) => {
			const conflicts = data.conflicts ?? [];
			if (conflicts.length > 0) {
				setConflictData({
					conflicts,
					suggested: data.suggested_slots ?? [],
					message: t("lessons.conflict_error"),
				});
				return;
			}
			queryClient.invalidateQueries({ queryKey: ["lessons"] });
			queryClient.invalidateQueries({ queryKey: ["calendar-grid"] });
			queryClient.invalidateQueries({ queryKey: ["classes"] });
			toast.success(t("lessons.reschedule_success"));
			onClose();
		},
		onError: (err: unknown) => {
			const payload = extractReschedulePayload(err);
			if (payload) {
				setConflictData({
					conflicts: payload.conflicts ?? [],
					suggested: payload.suggestedSlots ?? [],
					message:
						err instanceof ApiError
							? err.message
							: t("lessons.conflicts_found"),
				});
			} else {
				toast.error(
					err instanceof ApiError
						? err.message
						: t("common.something_went_wrong"),
				);
			}
		},
	});

	const onSubmit = (values: RescheduleFormValues) => {
		setConflictData(null);
		mutation.mutate({
			new_start: fromDateTimeLocal(values.new_start),
			new_end: values.new_end ? fromDateTimeLocal(values.new_end) : null,
			scope: values.scope,
		});
	};

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					<DialogTitle>{t("lessons.reschedule_title")}</DialogTitle>
					<DialogDescription>
						{formatDate(lesson.date)} - {formatTime(lesson.start_time)} to{" "}
						{formatTime(lesson.end_time)}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<FieldInput
							label={t("lessons.new_start")}
							type="datetime-local"
							required
							{...form.register("new_start")}
							error={form.formState.errors.new_start?.message}
						/>
						<FieldInput
							label={t("lessons.new_end")}
							type="datetime-local"
							{...form.register("new_end")}
							error={form.formState.errors.new_end?.message}
						/>
					</div>
					<Controller
						control={form.control}
						name="scope"
						render={({ field }) => (
							<div className="flex flex-col gap-1.5">
								<Label>{t("lessons.scope")}</Label>
								<Select
									value={field.value}
									onValueChange={(value) =>
										field.onChange(value as "this_only" | "this_and_future")
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="this_only">
											{t("lessons.this_only")}
										</SelectItem>
										<SelectItem value="this_and_future">
											{t("lessons.this_and_future")}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					/>
					{conflictData ? (
						<div className="flex flex-col gap-2 rounded-md border border-warning/30 bg-warning/5 p-3">
							<p className="text-sm font-medium">{conflictData.message}</p>
							{conflictData.conflicts.length > 0 ? (
								<ul className="flex flex-col gap-1 text-sm">
									{conflictData.conflicts.map((conflict, index) => (
										<li
											key={`${conflict.start}-${index}`}
											className="text-muted-foreground"
										>
											{conflict.student_name ?? "Student"} -{" "}
											{formatDateTime(conflict.start)} to{" "}
											{formatDateTime(conflict.end)}
										</li>
									))}
								</ul>
							) : null}
							{conflictData.suggested.length > 0 ? (
								<div className="flex flex-col gap-1.5">
									<p className="text-sm font-medium">
										{t("lessons.suggested_slots")}
									</p>
									{conflictData.suggested.map((slot, index) => (
										<Button
											key={`${slot.start}-${index}`}
											type="button"
											variant="outline"
											size="sm"
											className="justify-start"
											onClick={() => {
												form.setValue(
													"new_start",
													toDateTimeLocal(slot.start),
													{
														shouldValidate: true,
													},
												);
												form.setValue("new_end", toDateTimeLocal(slot.end), {
													shouldValidate: true,
												});
											}}
										>
											{formatDateTime(slot.start)} - {formatDateTime(slot.end)}
										</Button>
									))}
								</div>
							) : null}
						</div>
					) : null}
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={mutation.isPending}
						>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={mutation.isPending}>
							{t("lessons.reschedule")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminClassDetailPage() {
	const { t } = useLocalization();
	const params = useParams<{ scheduleId: string }>();
	const scheduleId = Number(params?.scheduleId);
	const isValid = Number.isInteger(scheduleId) && scheduleId > 0;

	const [page, setPage] = useState(1);
	const [editLesson, setEditLesson] = useState<LessonRead | null>(null);
	const [rescheduleTarget, setRescheduleTarget] = useState<LessonRead | null>(
		null,
	);
	const offset = (page - 1) * HISTORY_LIMIT;

	const schedulesQuery = useQuery({
		queryKey: ["schedules", { page: 1, perPage: 100 }],
		queryFn: () => listSchedules({ page: 1, perPage: 100 }),
		enabled: isValid,
	});

	const studentsQuery = useQuery({
		queryKey: ["students"],
		queryFn: () => listStudents({ perPage: 100 }),
		enabled: isValid,
	});

	const schedule = useMemo(
		() => schedulesQuery.data?.items.find((item: ScheduleRead) => item.id === scheduleId),
		[schedulesQuery.data, scheduleId],
	);
	const student = useMemo(
		() =>
			studentsQuery.data?.items.find(
				(item: StudentRead) => item.id === schedule?.student_id,
			),
		[studentsQuery.data, schedule?.student_id],
	);

	const attendanceQuery = useQuery({
		queryKey: ["classes", scheduleId, "attendance"],
		queryFn: () =>
			getClassAttendance(scheduleId, {
				startDate: monthStartISO(),
				endDate: todayISO(),
			}),
		enabled: isValid,
	});

	const historyQuery = useQuery({
		queryKey: ["classes", scheduleId, "history", offset],
		queryFn: () =>
			getClassHistory(scheduleId, { limit: HISTORY_LIMIT, offset }),
		enabled: isValid,
	});

	const summary = attendanceQuery.data;
	const statCards = summary
		? [
			{
				label: t("analytics.expected_sessions"),
				value: String(summary.expected_sessions),
			},
			{
				label: t("analytics.attended_sessions"),
				value: String(summary.attended_sessions),
			},
			{
				label: t("analytics.absent_sessions"),
				value: String(summary.absent_sessions),
			},
			{
				label: t("analytics.attendance_rate"),
				value: formatPercent(summary.attendance_rate, true),
			},
		]
		: [];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={student ? student.full_name_english : `Class #${scheduleId}`}
				description={
					schedule
						? `${schedule.day_label} - ${formatTime(schedule.start_time)} to ${formatTime(schedule.end_time)}`
						: undefined
				}
				actions={
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" asChild>
							<Link href="/platform/dashboard/admin/classes">
								<ArrowLeft className="rtl:rotate-180 size-4" />
								{t("lessons.title")}
							</Link>
						</Button>
						{isValid ? (
							<Button variant="outline" size="sm" asChild>
								<Link
									href={`/platform/dashboard/admin/schedules/${scheduleId}`}
								>
									{t("calendar.schedule")}
								</Link>
							</Button>
						) : null}
					</div>
				}
			/>
			{!isValid ? (
				<ErrorBanner message={t("error_messages.invalid_schedule_id")} />
			) : (
				<>
					{schedulesQuery.error || studentsQuery.error ? (
						<ErrorBanner message={t("error_messages.failed_load_class")} />
					) : null}
					{attendanceQuery.error ? (
						<ErrorBanner
							message={
								attendanceQuery.error instanceof Error
									? attendanceQuery.error.message
									: t("common.something_went_wrong")
							}
						/>
					) : null}
					{historyQuery.error ? (
						<ErrorBanner
							message={
								historyQuery.error instanceof Error
									? historyQuery.error.message
									: t("common.something_went_wrong")
							}
						/>
					) : null}

					{attendanceQuery.isLoading ? (
						<LoadingSkeleton rows={1} />
					) : summary ? (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{statCards.map((stat) => (
								<Card key={stat.label}>
									<CardContent className="flex flex-col gap-1">
										<p className="text-muted-foreground text-sm">
											{stat.label}
										</p>
										<p className="text-2xl font-semibold">{stat.value}</p>
									</CardContent>
								</Card>
							))}
						</div>
					) : null}

					<Card>
						<CardHeader>
							<CardTitle>{t("lessons.lesson_history")}</CardTitle>
							<CardDescription>{t("lessons.history_desc")}</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							{historyQuery.isLoading ? (
								<LoadingSkeleton rows={5} />
							) : (historyQuery.data?.lessons.length ?? 0) === 0 ? (
								<EmptyState
									title="No lessons yet"
									description="Record lessons from the Lessons page to see history here."
								/>
							) : (
								<>
									<div className="overflow-hidden rounded-lg border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>{t("common.date")}</TableHead>
													<TableHead>{t("common.time")}</TableHead>
													<TableHead>{t("lessons.attendance")}</TableHead>
													<TableHead>{t("lessons.heard")}</TableHead>
													<TableHead>{t("lessons.homework")}</TableHead>
													<TableHead className="text-end">
														{t("common.actions")}
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{historyQuery.data?.lessons.map((lesson: LessonRead) => (
													<TableRow key={lesson.id}>
														<TableCell>{formatDate(lesson.date)}</TableCell>
														<TableCell>
															{formatTime(lesson.start_time)} -{" "}
															{formatTime(lesson.end_time)}
														</TableCell>
														<TableCell>
															<Button
																variant="ghost"
																size="sm"
																className="h-auto p-0"
																onClick={() => setEditLesson(lesson)}
																aria-label="Edit lesson"
															>
																<AttendanceBadge status={lesson.attendance} />
															</Button>
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
														<TableCell className="text-end">
															<Button
																variant="outline"
																size="sm"
																onClick={() => setRescheduleTarget(lesson)}
															>
																{t("lessons.reschedule")}
															</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
									<Pagination
										page={page}
										perPage={HISTORY_LIMIT}
										total={historyQuery.data?.total ?? 0}
										onChange={setPage}
									/>
								</>
							)}
						</CardContent>
					</Card>

					<ClassFilesSection scheduleId={scheduleId} />

					{editLesson ? (
						<LessonEditDialog
							lesson={editLesson}
							onClose={() => setEditLesson(null)}
						/>
					) : null}
					{rescheduleTarget ? (
						<RescheduleDialog
							lesson={rescheduleTarget}
							onClose={() => setRescheduleTarget(null)}
						/>
					) : null}
				</>
			)}
		</div>
	);
}
