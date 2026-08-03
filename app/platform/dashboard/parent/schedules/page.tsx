"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { errorMessage } from "@/components/shared/error-text";
import { formatDate, formatTime } from "@/lib/dates";
import { useLocalization } from "@/lib/localization-context";
import { listMySchedules } from "@/lib/api/schedules";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useChildFilter } from "../child-filter";
import { ChildRead, ScheduleRead } from "@/lib/data-contracts";
import { getMyChildren } from "@/lib/api";

const PER_PAGE = 10;

export default function ParentSchedulesPage() {
	const { t } = useLocalization();
	const [page, setPage] = useState(1);
	const { studentId, childSelect } = useChildFilter({
		onStudentChange: () => setPage(1),
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["my-schedules", studentId ?? "all", page],
		queryFn: () => listMySchedules({ studentId, page, perPage: PER_PAGE }),
	});

	const { data: children = [], isLoading: isLoadingChildren, isError: isErrorChildren, error: childrenError } = useQuery({
		queryKey: ["my-children"],
		queryFn: getMyChildren,
	});


	const schedules = data?.items ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("schedules.title")}
				description={t("schedules.parent_desc")}
				actions={childSelect}
			/>
			{isLoading ||  isLoadingChildren? <LoadingSkeleton rows={6} /> : null}
			{isError ? <ErrorBanner message={errorMessage(error)} /> : null}
			{isErrorChildren ? <ErrorBanner message={errorMessage(childrenError)} /> : null}
			{!isLoading && !isError && !isLoadingChildren && !isErrorChildren && schedules.length === 0 ? (
				<EmptyState
					icon={CalendarClock}
					title={t("schedules.no_schedules_parent")}
					description={t("schedules.no_schedules_parent_desc")}
				/>
			) : null}
			{!isLoading && !isError && !isLoadingChildren && !isErrorChildren && schedules.length > 0 ? (
				<>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("profile.full_name")}</TableHead>
									<TableHead>{t("schedules.day")}</TableHead>
									<TableHead>{t("common.time")}</TableHead>
									<TableHead>{t("schedules.effective_from")}</TableHead>
									<TableHead>{t("common.notes")}</TableHead>
									<TableHead>{t("common.status")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{schedules.map((schedule: ScheduleRead) => (
									<TableRow key={schedule.id}>
										<TableCell>{children.find((child: ChildRead) => child.id === schedule.student_id)?.full_name_english || children.find((child: ChildRead) => child.id === schedule.student_id)?.full_name_arabic || `Student #${schedule.student_id}`}</TableCell>
										<TableCell>
											<Link
												href={`/platform/dashboard/parent/classes/${schedule.id}`}
												className="font-medium hover:underline"
											>
												{schedule.rrule_string?.split('BYDAY=')[1] ?? (schedule.rrule_string?.split('BYMONTHDAY=')[1]?? 'Daily')}
											</Link>
										</TableCell>
										<TableCell>
											{formatTime(schedule.start_time)} -{" "}
											{formatTime(schedule.end_time)}
										</TableCell>
										<TableCell>{formatDate(schedule.effective_from)}</TableCell>
										<TableCell className="max-w-70 whitespace-normal">
											{schedule.notes || "-"}
										</TableCell>
										<TableCell>
											<StatusBadge
												variant={schedule.is_active ? "success" : "secondary"}
											>
												{schedule.is_active
													? t("schedules.active")
													: t("schedules.inactive")}
											</StatusBadge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Pagination
						page={page}
						perPage={PER_PAGE}
						total={total}
						onChange={setPage}
					/>
				</>
			) : null}
		</div>
	);
}
