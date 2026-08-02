"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import {
	StatusBadge,
	StudentStatusBadge,
} from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api/client";
import { formatDate, formatTime } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import { getMyChildren } from "@/lib/api/parents";
import { listMySchedules } from "@/lib/api/schedules";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import type { ScheduleRead, StudentRead, StudentStatus } from "@/lib/data-contracts";

export default function ParentChildDetailPage() {
	const { t } = useLocalization();
	const params = useParams<{ childId: string }>();
	const childId = Number(params.childId);

	const childrenQuery = useQuery({
		queryKey: ["my-children"],
		queryFn: getMyChildren,
	});

	const child = childrenQuery.data?.find(
		(candidate: StudentRead) => candidate.id === childId,
	);

	const schedulesQuery = useQuery({
		queryKey: ["my-schedules", childId],
		queryFn: () =>
			listMySchedules({ studentId: childId, page: 1, perPage: 20 }),
		enabled: child !== undefined,
	});

	if (childrenQuery.isLoading) {
		return <LoadingSkeleton rows={5} />;
	}
	if (childrenQuery.isError) {
		return (
			<ErrorBanner
				message={
					childrenQuery.error instanceof ApiError
						? childrenQuery.error.message
						: "Something went wrong"
				}
			/>
		);
	}
	if (!child) {
		return (
			<div className="flex flex-col gap-4">
				<ErrorBanner message={t("error_messages.child_not_found")} />
				<Button variant="outline" asChild>
					<Link href="/platform/dashboard/parent/children">
						<ArrowLeft className="rtl:rotate-180 size-4" />
						{t("children.back")}
					</Link>
				</Button>
			</div>
		);
	}

	const details: Array<{ label: string; value: ReactNode }> = [
		{ label: "Full name (Arabic)", value: child.full_name_arabic },
		{ label: "Full name (English)", value: child.full_name_english },
		{
			label: "Date of birth",
			value: formatDate(child.date_of_birth) || "Not set",
		},
		{ label: "Timezone", value: child.timezone },
		{
			label: "Status",
			value: <StudentStatusBadge status={child.status as StudentStatus} />,
		},
		{ label: "Lessons per week", value: child.lessons_per_week },
		{ label: "Base rate", value: formatCurrency(child.base_rate) || "Not set" },
		{ label: "Private notes", value: child.private_notes || "None" },
		{ label: "Special notes", value: child.special_notes || "None" },
	];

	const schedules = schedulesQuery.data?.items ?? [];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={child.full_name_english}
				description={child.full_name_arabic}
				actions={
					<Button variant="outline" asChild>
						<Link href="/platform/dashboard/parent/children">
							<ArrowLeft className="rtl:rotate-180 size-4" />
							{t("children.back")}
						</Link>
					</Button>
				}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t("profile.title")}</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
						{details.map((detail) => (
							<div
								key={detail.label}
								className="flex items-center justify-between gap-4 border-b pb-2"
							>
								<dt className="text-muted-foreground">{detail.label}</dt>
								<dd className="text-end">{detail.value}</dd>
							</div>
						))}
					</dl>
				</CardContent>
			</Card>

			<section className="flex flex-col gap-3">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h2 className="text-lg font-semibold">{t("schedules.title")}</h2>
					<div className="flex flex-wrap gap-2">
						<Button variant="outline" size="sm" asChild>
							<Link href="/platform/dashboard/parent/classes">
								{t("children.view_classes")}
							</Link>
						</Button>
						<Button variant="outline" size="sm" asChild>
							<Link href="/platform/dashboard/parent/wird">
								{t("children.view_wird")}
							</Link>
						</Button>
					</div>
				</div>
				{schedulesQuery.isLoading ? <LoadingSkeleton rows={3} /> : null}
				{schedulesQuery.isError ? (
					<ErrorBanner
						message={
							schedulesQuery.error instanceof ApiError
								? schedulesQuery.error.message
								: "Something went wrong"
						}
					/>
				) : null}
				{schedulesQuery.isSuccess && schedules.length === 0 ? (
					<EmptyState
						title={t("children.no_schedules")}
						description={t("children.no_schedules_desc")}
					/>
				) : null}
				{schedules.length > 0 ? (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("schedules.day")}</TableHead>
									<TableHead>{t("common.time")}</TableHead>
									<TableHead>{t("schedules.effective_from")}</TableHead>
									<TableHead>{t("common.status")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{schedules.map((schedule: ScheduleRead) => (
									<TableRow key={schedule.id}>
										<TableCell>{schedule.day_label}</TableCell>
										<TableCell>
											{formatTime(schedule.start_time)} -{" "}
											{formatTime(schedule.end_time)}
										</TableCell>
										<TableCell>{formatDate(schedule.effective_from)}</TableCell>
										<TableCell>
											<StatusBadge
												variant={schedule.is_active ? "success" : "secondary"}
											>
												{schedule.is_active ? "Active" : "Inactive"}
											</StatusBadge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : null}
			</section>
		</div>
	);
}
