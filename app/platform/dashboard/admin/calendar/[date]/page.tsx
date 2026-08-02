"use client";
import { useLocalization } from "@/lib/localization-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { AttendanceBadge } from "@/components/shared/status-badge";
import { ApiError } from "@/lib/api/client";
import { getCalendarGrid } from "@/lib/api/calendar";
import { updateLesson } from "@/lib/api/lessons";
import { AttendanceStatus, type CalendarSlotItem } from "@/lib/data-contracts";
import { formatDate, formatTime } from "@/lib/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ATTENDANCE_OPTIONS: AttendanceStatus[] = [
	AttendanceStatus.Present,
	AttendanceStatus.Absent,
	AttendanceStatus.Late,
	AttendanceStatus.Excused,
];

interface SlotCardProps {
	slot: CalendarSlotItem;
	onSetAttendance: (lessonId: number, attendance: AttendanceStatus) => void;
	isPending: boolean;
}

function SlotCard({ slot, onSetAttendance, isPending }: SlotCardProps) {
	const { t } = useLocalization();
	const lesson = slot.lesson_data;
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">{slot.student_name_en}</CardTitle>
				<span className="text-muted-foreground text-sm">
					{formatTime(slot.start_time)} - {formatTime(slot.end_time)}
				</span>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				{lesson ? (
					<>
						<div className="flex flex-wrap items-center gap-3">
							<AttendanceBadge status={lesson.attendance} />
							{lesson.attendance === null ? (
								<div className="flex items-center gap-2">
									<Label className="text-muted-foreground text-xs">
										{t("calendar.set_attendance")}
									</Label>
									<Select
										value=""
										onValueChange={(value) =>
											onSetAttendance(lesson.id, value as AttendanceStatus)
										}
										disabled={isPending}
									>
										<SelectTrigger className="w-36">
											<SelectValue placeholder={t("common.select")} />
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
							) : null}
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Button variant="outline" size="sm" asChild>
								<Link
									href={`/platform/dashboard/admin/classes/${slot.schedule_id}`}
								>
									{t("calendar.class_page")}
								</Link>
							</Button>
							<Button variant="ghost" size="sm" asChild>
								<Link
									href={`/platform/dashboard/admin/schedules/${slot.schedule_id}`}
								>
									{t("calendar.schedule")}
								</Link>
							</Button>
						</div>
					</>
				) : (
					<>
						<p className="text-muted-foreground text-sm">
							{t("calendar.no_lesson")}
						</p>
						<Button variant="ghost" size="sm" className="w-fit" asChild>
							<Link
								href={`/platform/dashboard/admin/schedules/${slot.schedule_id}`}
							>
								{t("calendar.view_schedule")}
							</Link>
						</Button>
					</>
				)}
			</CardContent>
		</Card>
	);
}

export default function AdminCalendarDayPage() {
	const { t } = useLocalization();
	const params = useParams<{ date: string }>();
	const queryClient = useQueryClient();
	const date = params?.date ?? "";
	const isValidDate = DATE_PATTERN.test(date);

	const gridQuery = useQuery({
		queryKey: ["calendar-grid", date],
		queryFn: () => getCalendarGrid({ startDate: date }),
		enabled: isValidDate,
	});

	const slots = useMemo(
		() => (gridQuery.data?.slots ?? []).filter((slot: CalendarSlotItem) => slot.date === date),
		[gridQuery.data, date],
	);

	const attendanceMutation = useMutation({
		mutationFn: ({
			lessonId,
			attendance,
		}: {
			lessonId: number;
			attendance: AttendanceStatus;
		}) => updateLesson(lessonId, { attendance }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["calendar-grid"] });
			queryClient.invalidateQueries({ queryKey: ["lessons"] });
			toast.success(t("calendar.attendance_updated"));
		},
		onError: (err: unknown) =>
			toast.error(
				err instanceof ApiError
					? err.message
					: t("common.something_went_wrong"),
			),
	});

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={isValidDate ? formatDate(date) : t("calendar.day_view")}
				description={isValidDate ? `Lessons on ${date}` : undefined}
				actions={
					<Button variant="outline" size="sm" asChild>
						<Link href="/platform/dashboard/admin/calendar">
							<ArrowLeft className="rtl:rotate-180 size-4" />
							{t("calendar.back")}
						</Link>
					</Button>
				}
			/>
			{!isValidDate ? (
				<ErrorBanner message={t("error_messages.invalid_date")} />
			) : gridQuery.error ? (
				<ErrorBanner
					message={
						gridQuery.error instanceof Error
							? gridQuery.error.message
							: t("common.something_went_wrong")
					}
				/>
			) : gridQuery.isLoading ? (
				<LoadingSkeleton rows={4} />
			) : slots.length === 0 ? (
				<EmptyState
					icon={CalendarDays}
					title={t("calendar.no_lessons_day")}
					description={t("calendar.no_lessons_day_desc")}
				/>
			) : (
				<div className="flex flex-col gap-4">
					{slots.map((slot: CalendarSlotItem) => (
						<SlotCard
							key={`${slot.date}-${slot.schedule_id}-${slot.student_id}-${slot.start_time}`}
							slot={slot}
							onSetAttendance={(lessonId, attendance) =>
								attendanceMutation.mutate({ lessonId, attendance })
							}
							isPending={attendanceMutation.isPending}
						/>
					))}
				</div>
			)}
		</div>
	);
}
