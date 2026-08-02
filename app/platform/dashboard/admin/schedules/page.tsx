"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import {
	scheduleFormSchema,
	type ScheduleFormValues,
} from "@/app/platform/lib/schemas/schedule";
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
import { FieldInput } from "@/components/shared/field-input";
import { FieldTextarea } from "@/components/shared/field-textarea";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/client";
import {
	createSchedule,
	deactivateSchedule,
	listSchedules,
	updateSchedule,
} from "@/lib/api/schedules";
import { listStudents } from "@/lib/api/students";
import type {
	ScheduleCreate,
	ScheduleRead,
	ScheduleUpdate,
	StudentRead,
} from "@/lib/data-contracts";
import { formatDate, formatTime, parseDateOnly, todayISO } from "@/lib/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RRule, type WeekdayStr } from "rrule";
import { toast } from "sonner";

const PER_PAGE = 20;

const WEEKDAYS: WeekdayStr[] = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const WEEKDAY_LABELS: Record<WeekdayStr, string> = {
	MO: "schedules.monday",
	TU: "schedules.tuesday",
	WE: "schedules.wednesday",
	TH: "schedules.thursday",
	FR: "schedules.friday",
	SA: "schedules.saturday",
	SU: "schedules.sunday",
};

type ScheduleFrequency = "once" | "daily" | "weekly" | "monthly";

const FREQUENCIES: { value: ScheduleFrequency; labelKey: string }[] = [
	{ value: "once", labelKey: "schedules.frequency_once" },
	{ value: "daily", labelKey: "schedules.frequency_daily" },
	{ value: "weekly", labelKey: "schedules.frequency_weekly" },
	{ value: "monthly", labelKey: "schedules.frequency_monthly" },
];

interface ParsedRrule {
	freq: ScheduleFrequency;
	weekdays: WeekdayStr[];
	monthDays: number[];
	until: string | null;
}

const DEFAULT_PARSED_RRULE: ParsedRrule = {
	freq: "weekly",
	weekdays: ["MO"],
	monthDays: [1],
	until: null,
};

/** "HH:MM:SS" -> "HH:MM" for time inputs. */
function toTimeInput(value: string | null | undefined): string {
	return value ? value.slice(0, 5) : "";
}

/** "HH:MM" -> "HH:MM:SS" for the API. */
function toTimeSeconds(value: string): string {
	return value.length === 5 ? `${value}:00` : value;
}

/** Build an RFC 5545 RRULE string from freq, days, and until. Returns null for one-off schedules. */
function buildRruleString(
	freq: ScheduleFrequency,
	weekdays: WeekdayStr[],
	monthDays: number[],
	until: string | null,
): string | null {
	if (freq === "once") {
		return null;
	}
	const untilDate = until ? parseDateOnly(until) : undefined;
	try {
		let rule: RRule;
		if (freq === "daily") {
			rule = new RRule({ freq: RRule.DAILY, until: untilDate });
		} else if (freq === "monthly") {
			rule = new RRule({
				freq: RRule.MONTHLY,
				bymonthday: monthDays,
				until: untilDate,
			});
		} else {
			rule = new RRule({
				freq: RRule.WEEKLY,
				byweekday: weekdays.map((day) => RRule[day]),
				until: untilDate,
			});
		}
		return rule.toString().replace(/^RRULE:/, "");
	} catch {
		// Serialization can fail for edge cases (for example a past UNTIL date); fall back to a one-off schedule.
		return null;
	}
}

/** Extract freq, weekdays, month days, and until from an existing RRULE string. */
function parseRruleString(rruleString: string | null): ParsedRrule {
	if (!rruleString) {
		return { ...DEFAULT_PARSED_RRULE };
	}
	try {
		const options = RRule.fromString(rruleString).options;
		let freq: ScheduleFrequency = "weekly";
		if (options.freq === RRule.DAILY) {
			freq = "daily";
		} else if (options.freq === RRule.MONTHLY) {
			freq = "monthly";
		}
		const weekdays = (options.byweekday ?? [])
			.map((index) => WEEKDAYS[index])
			.filter((day): day is WeekdayStr => day !== undefined);
		const monthDays = (options.bymonthday ?? []).filter(
			(day) => day >= 1 && day <= 31,
		);
		return {
			freq,
			weekdays: weekdays.length > 0 ? weekdays : DEFAULT_PARSED_RRULE.weekdays,
			monthDays:
				monthDays.length > 0 ? monthDays : DEFAULT_PARSED_RRULE.monthDays,
			until: options.until ? options.until.toISOString().slice(0, 10) : null,
		};
	} catch {
		return { ...DEFAULT_PARSED_RRULE };
	}
}

interface ScheduleDialogProps {
	schedule: ScheduleRead | null;
	students: StudentRead[];
	onClose: () => void;
	onSaved: () => void;
}

function ScheduleDialog({
	schedule,
	students,
	onClose,
	onSaved,
}: ScheduleDialogProps) {
	const { t } = useLocalization();
	const isEdit = schedule !== null;
	const queryClient = useQueryClient();
	const initialRrule = useMemo(
		() =>
			schedule
				? parseRruleString(schedule.rrule_string)
				: { ...DEFAULT_PARSED_RRULE },
		[schedule],
	);
	const [freq, setFreq] = useState<ScheduleFrequency>(initialRrule.freq);
	const [weekdays, setWeekdays] = useState<WeekdayStr[]>(
		initialRrule.weekdays,
	);
	const [monthDays, setMonthDays] = useState<number[]>(initialRrule.monthDays);
	const [until, setUntil] = useState(initialRrule.until ?? "");

	const form = useForm<ScheduleFormValues>({
		resolver: useZodResolver(scheduleFormSchema),
		defaultValues: isEdit
			? {
				student_id: schedule.student_id,
				start_time: toTimeInput(schedule.start_time),
				end_time: toTimeInput(schedule.end_time),
				effective_from: schedule.effective_from,
				notes: schedule.notes ?? "",
				is_active: schedule.is_active,
				cancellation_reason: schedule.cancellation_reason ?? "",
			}
			: {
				student_id: 0,
				start_time: "10:00",
				end_time: "11:00",
				effective_from: todayISO(),
				notes: "",
				is_active: true,
				cancellation_reason: "",
			},
	});

	const mutation = useMutation({
		mutationFn: (payload: ScheduleCreate | ScheduleUpdate) =>
			isEdit
				? updateSchedule(schedule.id, payload as ScheduleUpdate)
				: createSchedule(payload as ScheduleCreate),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["schedules"] });
			queryClient.invalidateQueries({ queryKey: ["classes"] });
			queryClient.invalidateQueries({ queryKey: ["calendar-grid"] });
			toast.success(
				isEdit ? t("schedules.update_success") : t("schedules.create_success"),
			);
			onSaved();
		},
		onError: (err: unknown) =>
			toast.error(
				err instanceof ApiError
					? err.message
					: t("common.something_went_wrong"),
			),
	});

	const toggleWeekday = (day: WeekdayStr) => {
		setWeekdays((current) => {
			const next = current.includes(day)
				? current.length > 1
					? current.filter((item) => item !== day)
					: current
				: [...current, day];
			return WEEKDAYS.filter((item) => next.includes(item));
		});
	};

	const toggleMonthDay = (day: number) => {
		setMonthDays((current) => {
			const next = current.includes(day)
				? current.length > 1
					? current.filter((item) => item !== day)
					: current
				: [...current, day];
			return [...next].sort((a, b) => a - b);
		});
	};

	const onSubmit = (values: ScheduleFormValues) => {
		const rruleString = buildRruleString(freq, weekdays, monthDays, until || null);
		if (isEdit) {
			mutation.mutate({
				rrule_string: rruleString,
				start_time: values.start_time
					? toTimeSeconds(values.start_time)
					: undefined,
				end_time: values.end_time ? toTimeSeconds(values.end_time) : undefined,
				effective_from: values.effective_from || undefined,
				is_active: values.is_active,
				cancellation_reason: values.cancellation_reason || null,
				notes: values.notes || null,
			});
		} else {
			mutation.mutate({
				student_id: values.student_id,
				rrule_string: rruleString,
				start_time: toTimeSeconds(values.start_time),
				end_time: toTimeSeconds(values.end_time),
				effective_from: values.effective_from,
				notes: values.notes || null,
			});
		}
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
					<DialogTitle>
						{isEdit
							? t("schedules.update_schedule")
							: t("schedules.create_title")}
					</DialogTitle>
					<DialogDescription>
						{isEdit ? t("schedules.edit_desc") : t("schedules.create_desc")}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
				>
					{!isEdit ? (
						<Controller
							control={form.control}
							name="student_id"
							render={({ field, fieldState }) => (
								<div className="flex flex-col gap-1.5">
									<Label>{t("common.student")}</Label>
									<SearchableSelect
										value={field.value ? String(field.value) : ""}
										onValueChange={(value) => field.onChange(Number(value))}
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
					) : null}
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<Label>{t("schedules.frequency")}</Label>
							<Select
								value={freq}
								onValueChange={(value) =>
									setFreq(value as ScheduleFrequency)
								}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{FREQUENCIES.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{t(option.labelKey)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{freq !== "once" ? (
							<FieldInput
								label={t("schedules.until_optional")}
								type="date"
								value={until}
								onChange={(event) => setUntil(event.target.value)}
							/>
						) : null}
						{freq === "weekly" ? (
							<div className="flex flex-col gap-1.5 sm:col-span-2">
								<Label>{t("schedules.day_of_week")}</Label>
								<div
									className="flex flex-wrap gap-1.5"
									role="group"
									aria-label={t("schedules.select_weekdays")}
								>
									{WEEKDAYS.map((day) => {
										const selected = weekdays.includes(day);
										return (
											<button
												key={day}
												type="button"
												aria-pressed={selected}
												onClick={() => toggleWeekday(day)}
												className={cn(
													"rounded-md border px-3 py-1.5 text-sm transition-colors",
													selected
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground",
												)}
											>
												{t(WEEKDAY_LABELS[day])}
											</button>
										);
									})}
								</div>
								<p className="text-muted-foreground text-xs">
									{weekdays.length === 0
										? t("schedules.at_least_one_day")
										: t("schedules.select_weekdays")}
								</p>
							</div>
						) : null}
						{freq === "monthly" ? (
							<div className="flex flex-col gap-1.5 sm:col-span-2">
								<Label>{t("schedules.select_month_days")}</Label>
								<div
									className="flex flex-wrap gap-1.5"
									role="group"
									aria-label={t("schedules.select_month_days")}
								>
									{Array.from({ length: 31 }, (_, index) => index + 1).map(
										(day) => {
											const selected = monthDays.includes(day);
											return (
												<button
													key={day}
													type="button"
													aria-pressed={selected}
													onClick={() => toggleMonthDay(day)}
													className={cn(
														"rounded-md border px-3 py-1.5 text-sm transition-colors",
														selected
															? "bg-primary text-primary-foreground"
															: "bg-muted text-muted-foreground",
													)}
												>
													{day}
												</button>
											);
										},
									)}
								</div>
							</div>
						) : null}
						{freq === "daily" ? (
							<p className="text-muted-foreground text-sm sm:col-span-2">
								{t("schedules.daily_hint")}
							</p>
						) : null}
						<FieldInput
							label={t("schedules.start_time")}
							autoFocus
							type="time"
							required
							{...form.register("start_time")}
							error={form.formState.errors.start_time?.message}
						/>
						<FieldInput
							label={t("schedules.end_time")}
							type="time"
							required
							{...form.register("end_time")}
							error={form.formState.errors.end_time?.message}
						/>
						<FieldInput
							label={t("schedules.effective_from")}
							type="date"
							required
							{...form.register("effective_from")}
							error={form.formState.errors.effective_from?.message}
						/>
						{isEdit ? (
							<div className="flex flex-col gap-1.5">
								<Label>{t("schedules.active")}</Label>
								<Select
									value={form.watch("is_active") ? "true" : "false"}
									onValueChange={(value) =>
										form.setValue("is_active", value === "true")
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="true">
											{t("schedules.active")}
										</SelectItem>
										<SelectItem value="false">
											{t("schedules.inactive")}
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						) : null}
					</div>
					{isEdit ? (
						<FieldInput
							label={t("schedules.cancellation_reason")}
							{...form.register("cancellation_reason")}
							placeholder={t("schedules.deactivate_reason_placeholder")}
						/>
					) : null}
					<FieldTextarea
						label={t("schedules.notes")}
						{...form.register("notes")}
						placeholder={t("schedules.notes_placeholder")}
					/>
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
							{isEdit ? t("common.save_changes") : t("schedules.create_button")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminSchedulesPage() {
	const { t } = useLocalization();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [dialog, setDialog] = useState<
		{ mode: "create" } | { mode: "edit"; schedule: ScheduleRead } | null
	>(null);

	const schedulesQuery = useQuery({
		queryKey: ["schedules", page],
		queryFn: () => listSchedules({ page, perPage: PER_PAGE }),
	});

	const studentsQuery = useQuery({
		queryKey: ["students"],
		queryFn: () => listStudents({ perPage: 100 }),
	});
	const students = studentsQuery.data?.items ?? [];
	const studentName = (studentId: number) =>
		students.find((student: StudentRead) => student.id === studentId)?.full_name_english ??
		`Student #${studentId}`;

	const deleteMutation = useMutation({
		mutationFn: (scheduleId: number) => deactivateSchedule(scheduleId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["schedules"] });
			queryClient.invalidateQueries({ queryKey: ["classes"] });
			queryClient.invalidateQueries({ queryKey: ["calendar-grid"] });
			toast.success(t("schedules.deactivated_success"));
		},
		onError: (err: unknown) =>
			toast.error(
				err instanceof ApiError
					? err.message
					: t("common.something_went_wrong"),
			),
	});

	const schedules = schedulesQuery.data?.items ?? [];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("schedules.title")}
				description={t("schedules.description")}
				actions={
					<Button onClick={() => setDialog({ mode: "create" })}>
						<CalendarPlus className="size-4" />
						{t("schedules.create_title")}
					</Button>
				}
			/>
			{studentsQuery.error ? (
				<ErrorBanner
					message={
						studentsQuery.error instanceof Error
							? studentsQuery.error.message
							: t("common.something_went_wrong")
					}
				/>
			) : null}
			{schedulesQuery.error ? (
				<ErrorBanner
					message={
						schedulesQuery.error instanceof Error
							? schedulesQuery.error.message
							: t("common.something_went_wrong")
					}
				/>
			) : null}
			{schedulesQuery.isLoading ? (
				<LoadingSkeleton rows={6} />
			) : schedules.length === 0 ? (
				<EmptyState
					title={t("schedules.no_schedules")}
					description={t("schedules.no_schedules_desc")}
					action={
						<Button onClick={() => setDialog({ mode: "create" })}>
							<CalendarPlus className="size-4" />
							{t("schedules.create_title")}
						</Button>
					}
				/>
			) : (
				<>
					<div className="overflow-hidden rounded-lg border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("common.student")}</TableHead>
									<TableHead>{t("schedules.day")}</TableHead>
									<TableHead>{t("common.time")}</TableHead>
									<TableHead>{t("schedules.effective_from")}</TableHead>
									<TableHead>{t("common.status")}</TableHead>
									<TableHead>{t("schedules.notes")}</TableHead>
									<TableHead className="text-end">
										{t("common.actions")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{schedules.map((schedule: ScheduleRead) => (
									<TableRow
										key={schedule.id}
										className="cursor-pointer"
										onClick={() =>
											router.push(
												`/platform/dashboard/admin/schedules/${schedule.id}`,
											)
										}
									>
										<TableCell className="font-medium">
											{studentName(schedule.student_id)}
										</TableCell>
										<TableCell>{schedule.day_label}</TableCell>
										<TableCell>
											{formatTime(schedule.start_time)} -{" "}
											{formatTime(schedule.end_time)}
										</TableCell>
										<TableCell>{formatDate(schedule.effective_from)}</TableCell>
										<TableCell>
											{schedule.is_active ? (
												<StatusBadge variant="success">
													{t("schedules.active")}
												</StatusBadge>
											) : (
												<StatusBadge variant="secondary">
													{t("schedules.inactive")}
												</StatusBadge>
											)}
										</TableCell>
										<TableCell>
											{schedule.notes ? (
												<span className="text-muted-foreground line-clamp-1 max-w-48">
													{schedule.notes}
												</span>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell>
											<div
												className="flex items-center justify-end gap-1"
												onClick={(event) => event.stopPropagation()}
											>
												<Button
													variant="ghost"
													size="icon"
													onClick={() => setDialog({ mode: "edit", schedule })}
													aria-label={t("schedules.edit_aria")}
												>
													<Pencil className="size-4" />
												</Button>
												<ConfirmDialog
													trigger={
														<Button
															variant="ghost"
															size="icon"
															aria-label={t("schedules.deactivate_aria")}
														>
															<Trash2 className="size-4" />
														</Button>
													}
													title={t("schedules.deactivate_title")}
													description={`Deactivate the ${schedule.day_label} schedule for ${studentName(schedule.student_id)}?`}
													confirmLabel={t("schedules.deactivate")}
													destructive
													onConfirm={() => deleteMutation.mutate(schedule.id)}
												/>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Pagination
						page={page}
						perPage={PER_PAGE}
						total={schedulesQuery.data?.total ?? 0}
						onChange={setPage}
					/>
				</>
			)}
			{dialog ? (
				<ScheduleDialog
					key={dialog.mode === "edit" ? dialog.schedule.id : "create"}
					schedule={dialog.mode === "edit" ? dialog.schedule : null}
					students={students}
					onClose={() => setDialog(null)}
					onSaved={() => setDialog(null)}
				/>
			) : null}
		</div>
	);
}
