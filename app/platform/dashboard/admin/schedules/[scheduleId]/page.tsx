"use client";
import { useLocalization } from "@/lib/localization-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassFilesSection } from "@/components/shared/class-files-section";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { listSchedules } from "@/lib/api/schedules";
import { listStudents } from "@/lib/api/students";
import { formatDate, formatTime } from "@/lib/dates";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScheduleRead, StudentRead } from "@/lib/data-contracts";

export default function AdminScheduleDetailPage() {
	const { t } = useLocalization();
	const params = useParams<{ scheduleId: string }>();
	const scheduleId = Number(params?.scheduleId);
	const isValid = Number.isInteger(scheduleId) && scheduleId > 0;

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

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={student ? student.full_name_english : `Schedule #${scheduleId}`}
				description={
					schedule
						? `${schedule.day_label} - ${formatTime(schedule.start_time)} to ${formatTime(schedule.end_time)} - From ${formatDate(schedule.effective_from)}`
						: undefined
				}
				actions={
					<div className="flex items-center gap-2">
						<Button variant="outline" size="sm" asChild>
							<Link href="/platform/dashboard/admin/schedules">
								<ArrowLeft className="rtl:rotate-180 size-4" />
								{t("schedules.title")}
							</Link>
						</Button>
						{isValid ? (
							<Button variant="outline" size="sm" asChild>
								<Link href={`/platform/dashboard/admin/classes/${scheduleId}`}>
									{t("schedules.classes_attendance")}
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
						<ErrorBanner message={t("error_messages.failed_load_schedule")} />
					) : null}
					{schedulesQuery.isLoading || studentsQuery.isLoading ? (
						<LoadingSkeleton rows={3} />
					) : !schedule ? (
						<EmptyState
							title={t("schedules.not_found")}
							description={t("schedules.not_found_desc")}
						/>
					) : (
						<>
							<Card>
								<CardContent className="flex flex-col gap-4">
									<div className="flex flex-wrap items-center gap-3">
										{schedule.is_active ? (
											<StatusBadge variant="success">
												{t("schedules.active")}
											</StatusBadge>
										) : (
											<StatusBadge variant="secondary">
												{t("schedules.inactive")}
											</StatusBadge>
										)}
										<span className="text-sm">{schedule.day_label}</span>
										<span className="text-muted-foreground text-sm">
											{formatTime(schedule.start_time)} -{" "}
											{formatTime(schedule.end_time)}
										</span>
									</div>
									<dl className="grid gap-3 text-sm sm:grid-cols-2">
										<div>
											<dt className="text-muted-foreground">
												{t("common.student")}
											</dt>
											<dd>
												{student
													? student.full_name_english
													: `Student #${schedule.student_id}`}
											</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">
												{t("schedules.effective_from")}
											</dt>
											<dd>{formatDate(schedule.effective_from)}</dd>
										</div>
										<div>
											<dt className="text-muted-foreground">
												{t("schedules.recurring")}
											</dt>
											<dd className="font-mono text-xs">
												{schedule.rrule_string ?? t("schedules.one_off")}
											</dd>
										</div>
										{schedule.cancellation_reason ? (
											<div>
												<dt className="text-muted-foreground">
													{t("schedules.cancellation_reason")}
												</dt>
												<dd>{schedule.cancellation_reason}</dd>
											</div>
										) : null}
										{schedule.notes ? (
											<div>
												<dt className="text-muted-foreground">
													{t("schedules.notes")}
												</dt>
												<dd>{schedule.notes}</dd>
											</div>
										) : null}
									</dl>
								</CardContent>
							</Card>
							<ClassFilesSection scheduleId={scheduleId} />
						</>
					)}
				</>
			)}
		</div>
	);
}
