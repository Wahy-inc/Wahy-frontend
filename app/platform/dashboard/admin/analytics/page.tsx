"use client";
import { useLocalization } from "@/lib/localization-context";

import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/shared/searchable-select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DateRangePicker } from "@/components/shared/date-range-picker";
import { ErrorBanner } from "@/components/shared/error-banner";
import { errorMessage } from "@/components/shared/error-text";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import {
	getAttendanceAnalytics,
	getFinancialAnalytics,
	getOperationalAnalytics,
	getPerformanceAnalytics,
} from "@/lib/api/analytics";
import { listParents } from "@/lib/api/parents";
import { getStudentAttendanceHours, listStudents } from "@/lib/api/students";
import { formatCurrency, formatPercent } from "@/lib/format";
import { shiftDate, todayISO } from "@/lib/dates";
import type { ReactNode } from "react";
import type { StudentRead } from "@/lib/data-contracts";

const RANGE_PRESETS = [7, 30, 90];

const STUDENTS_PAGE_SIZE = 100;

function studentName(student: StudentRead): string {
	return student.full_name_english || student.full_name_arabic;
}

function hoursLabel(value: number | null | undefined): string {
	if (value === null || value === undefined) {
		return "";
	}
	return `${value.toFixed(1)} h`;
}

function KpiCard({ label, value }: { label: string; value: string }) {
	return (
		<Card className="gap-1 py-4">
			<CardContent className="flex flex-col gap-1 px-4">
				<span className="text-muted-foreground text-sm">{label}</span>
				<span className="text-2xl font-semibold">{value}</span>
			</CardContent>
		</Card>
	);
}

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-3">
			<h2 className="text-lg font-semibold">{title}</h2>
			{children}
		</section>
	);
}

export default function AdminAnalyticsPage() {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [startDate, setStartDate] = useState(() => shiftDate(todayISO(), -30));
	const [endDate, setEndDate] = useState(() => todayISO());
	const [studentFilter, setStudentFilter] = useState("all");

	const studentsQuery = useQuery({
		queryKey: ["students"],
		queryFn: () => listStudents({ perPage: STUDENTS_PAGE_SIZE }),
	});

	const parentsQuery = useQuery({
		queryKey: ["parents"],
		queryFn: () => listParents({ perPage: 100 }),
	});

	const parents = parentsQuery.data?.items ?? [];
	const parentName = (parentId: number) =>
		parents.find((p) => p.id === parentId)?.full_name ?? `Parent #${parentId}`;

	const analytics = useQueries({
		queries: [
			{
				queryKey: ["analytics", startDate, endDate, "attendance"],
				queryFn: () => getAttendanceAnalytics({ startDate, endDate }),
			},
			{
				queryKey: ["analytics", startDate, endDate, "performance"],
				queryFn: () => getPerformanceAnalytics({ startDate, endDate }),
			},
			{
				queryKey: ["analytics", startDate, endDate, "financial"],
				queryFn: () => getFinancialAnalytics({ startDate, endDate }),
			},
			{
				queryKey: ["analytics", startDate, endDate, "operational"],
				queryFn: () => getOperationalAnalytics({ startDate, endDate }),
			},
		],
	});

	const [attendance, performance, financial, operational] = analytics;

	const selectedStudentId =
		studentFilter === "all" ? null : Number(studentFilter);

	const hoursQuery = useQuery({
		queryKey: [
			"analytics",
			"student-hours",
			selectedStudentId,
			startDate,
			endDate,
		],
		queryFn: () =>
			getStudentAttendanceHours(selectedStudentId as number, {
				startDate,
				endDate,
			}),
		enabled: selectedStudentId !== null,
	});

	const analyticsLoading =
		attendance.isLoading ||
		performance.isLoading ||
		financial.isLoading ||
		operational.isLoading;

	const analyticsError =
		attendance.error ??
		performance.error ??
		financial.error ??
		operational.error;

	const showAnalytics =
		!analyticsLoading &&
		!analyticsError &&
		attendance.data !== undefined &&
		performance.data !== undefined &&
		financial.data !== undefined &&
		operational.data !== undefined;

	return (
		<div className="flex flex-col gap-8">
			<PageHeader
				title={t("analytics.title")}
				description={t("analytics.description")}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t("analytics.period")}</CardTitle>
					<CardDescription>{t("analytics.period_desc")}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="mb-3 flex flex-wrap items-center gap-2">
						{RANGE_PRESETS.map((days) => (
							<Button
								key={days}
								type="button"
								size="sm"
								variant={
									startDate === shiftDate(todayISO(), -days) &&
										endDate === todayISO()
										? "default"
										: "outline"
								}
								onClick={() => {
									setStartDate(shiftDate(todayISO(), -days));
									setEndDate(todayISO());
								}}
							>
								{t("analytics.last_days", { days })}
							</Button>
						))}
					</div>
					<DateRangePicker
						startName="analytics-start"
						endName="analytics-end"
						startLabel={t("common.start")}
						endLabel={t("common.end")}
						startValue={startDate}
						endValue={endDate}
						onChange={(start, end) => {
							setStartDate(start);
							setEndDate(end);
						}}
					/>
				</CardContent>
			</Card>

			{analyticsLoading ? <LoadingSkeleton rows={4} /> : null}

			{!analyticsLoading && analyticsError ? (
				<div className="flex flex-col items-start gap-3">
					<ErrorBanner message={errorMessage(analyticsError)} />
					<Button
						variant="outline"
						onClick={() =>
							void queryClient.invalidateQueries({ queryKey: ["analytics"] })
						}
					>
						{t("common.retry")}
					</Button>
				</div>
			) : null}

			{showAnalytics ? (
				<>
					<Section title={t("analytics.attendance_analytics")}>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
							<KpiCard
								label={t("analytics.total_lessons")}
								value={String(attendance.data.total_lessons)}
							/>
							<KpiCard
								label={t("analytics.present")}
								value={String(attendance.data.present_count)}
							/>
							<KpiCard
								label={t("analytics.late")}
								value={String(attendance.data.late_count)}
							/>
							<KpiCard
								label={t("analytics.absent")}
								value={String(attendance.data.absent_count)}
							/>
							<KpiCard
								label={t("analytics.excused")}
								value={String(attendance.data.excused_count)}
							/>
							<KpiCard
								label={t("analytics.attendance_rate")}
								value={formatPercent(attendance.data.attendance_rate, false)}
							/>
						</div>
					</Section>

					<Section title={t("analytics.performance_analytics")}>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<KpiCard
								label={t("analytics.attended_lessons")}
								value={String(performance.data.attended_count)}
							/>
							<KpiCard
								label={t("analytics.attendance_rate")}
								value={formatPercent(performance.data.attendance_rate, false)}
							/>
							<KpiCard
								label={t("analytics.timeliness_rate")}
								value={formatPercent(performance.data.timeliness_rate, false)}
							/>
							<KpiCard
								label={t("analytics.determination_score")}
								value={formatPercent(
									performance.data.determination_score,
									false,
								)}
							/>
						</div>
					</Section>

					<Section title={t("analytics.financial_analytics")}>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<KpiCard
								label={t("analytics.total_revenue")}
								value={formatCurrency(financial.data.total_revenue)}
							/>
							<KpiCard
								label={t("analytics.invoices")}
								value={String(financial.data.invoice_count)}
							/>
							<KpiCard
								label={t("invoices.overdue")}
								value={String(financial.data.overdue_count)}
							/>
						</div>
						<Card>
							<CardHeader>
								<CardTitle>{t("analytics.revenue_per_parent")}</CardTitle>
								<CardDescription>{t("analytics.revenue_desc")}</CardDescription>
							</CardHeader>
							{financial.data.revenue_per_student.length === 0 ? (
								<CardContent>
									<p className="text-muted-foreground text-sm">
										{t("analytics.no_revenue")}
									</p>
								</CardContent>
							) : (
								<CardContent className="p-0">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>{t("analytics.parent")}</TableHead>
												<TableHead className="text-end">
													{t("analytics.revenue")}
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{financial.data.revenue_per_student.map((entry) => (
												<TableRow key={entry.parent_id}>
													<TableCell>{parentName(entry.parent_id)}</TableCell>
													<TableCell className="text-end">
														{formatCurrency(entry.total_revenue)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</CardContent>
							)}
						</Card>
					</Section>

					<Section title={t("analytics.operational_analytics")}>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							<KpiCard
								label={t("analytics.new_registrations")}
								value={String(operational.data.new_registrations)}
							/>
							<KpiCard
								label={t("analytics.active_students")}
								value={String(operational.data.active_students)}
							/>
							<KpiCard
								label={t("analytics.lessons_recorded")}
								value={String(operational.data.lessons_recorded)}
							/>
						</div>
					</Section>
				</>
			) : null}

			<Section title={t("analytics.student_attendance_hours")}>
				<div className="w-full sm:w-72">
					<Label htmlFor="hours-student">{t("common.student")}</Label>
					<SearchableSelect
						value={studentFilter}
						onValueChange={setStudentFilter}
						options={
							studentsQuery.data?.items.map((student) => ({
								value: String(student.id),
								label: studentName(student),
							})) ?? []
						}
						placeholder={t("analytics.select_student")}
					/>
				</div>

				{selectedStudentId === null ? (
					<Card className="py-4">
						<CardContent className="px-4">
							<p className="text-muted-foreground text-sm">
								{t("analytics.select_student_hint")}
							</p>
						</CardContent>
					</Card>
				) : null}

				{selectedStudentId !== null && hoursQuery.isLoading ? (
					<LoadingSkeleton rows={2} />
				) : null}

				{selectedStudentId !== null && hoursQuery.isError ? (
					<ErrorBanner message={errorMessage(hoursQuery.error)} />
				) : null}

				{selectedStudentId !== null && hoursQuery.data ? (
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<KpiCard
							label={t("analytics.hours_per_month")}
							value={hoursLabel(hoursQuery.data.hours_per_month)}
						/>
						<KpiCard
							label={t("analytics.hours_attended")}
							value={hoursLabel(hoursQuery.data.hours_attended)}
						/>
						<KpiCard
							label={t("analytics.absent_hours")}
							value={hoursLabel(hoursQuery.data.absent_hours)}
						/>
						<KpiCard
							label={t("analytics.remaining_hours")}
							value={hoursLabel(hoursQuery.data.remaining_hours)}
						/>
					</div>
				) : null}
			</Section>
		</div>
	);
}
