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

	const schedules = data?.items ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("schedules.title")}
				description={t("schedules.parent_desc")}
				actions={childSelect}
			/>
			{isLoading ? <LoadingSkeleton rows={6} /> : null}
			{isError ? <ErrorBanner message={errorMessage(error)} /> : null}
			{!isLoading && !isError && schedules.length === 0 ? (
				<EmptyState
					icon={CalendarClock}
					title={t("schedules.no_schedules_parent")}
					description={t("schedules.no_schedules_parent_desc")}
				/>
			) : null}
			{!isLoading && !isError && schedules.length > 0 ? (
				<>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("schedules.day")}</TableHead>
									<TableHead>{t("common.time")}</TableHead>
									<TableHead>{t("schedules.effective_from")}</TableHead>
									<TableHead>{t("common.notes")}</TableHead>
									<TableHead>{t("common.status")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{schedules.map((schedule) => (
									<TableRow key={schedule.id}>
										<TableCell>
											<Link
												href={`/platform/dashboard/parent/classes/${schedule.id}`}
												className="font-medium hover:underline"
											>
												{schedule.day_label}
											</Link>
										</TableCell>
										<TableCell>
											{formatTime(schedule.start_time)} -{" "}
											{formatTime(schedule.end_time)}
										</TableCell>
										<TableCell>{formatDate(schedule.effective_from)}</TableCell>
										<TableCell className="max-w-[280px] whitespace-normal">
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
