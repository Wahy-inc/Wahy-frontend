"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { AttendanceBadge } from "@/components/shared/status-badge";
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
import { errorMessage } from "@/components/shared/error-text";
import { getMyClassAttendance, getMyClassHistory } from "@/lib/api/classes";
import { downloadMyClassFile, listMyClassFiles } from "@/lib/api/classFiles";
import {
	formatDate,
	formatDateTime,
	formatTime,
	monthStartISO,
	todayISO,
} from "@/lib/dates";
import { formatBytes, formatPercent } from "@/lib/format";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import type { ClassFileRead, LessonRead } from "@/lib/data-contracts";

const HISTORY_LIMIT = 20;

function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}

export default function ParentClassDetailPage() {
	const { t } = useLocalization();
	const params = useParams<{ scheduleId: string }>();
	const scheduleId = Number(params.scheduleId);
	const validId = Number.isFinite(scheduleId);
	const [page, setPage] = useState(1);
	const offset = (page - 1) * HISTORY_LIMIT;

	const attendanceQuery = useQuery({
		queryKey: ["my-classes", scheduleId, "attendance"],
		queryFn: () =>
			getMyClassAttendance(scheduleId, {
				startDate: monthStartISO(),
				endDate: todayISO(),
			}),
		enabled: validId,
	});

	const historyQuery = useQuery({
		queryKey: ["my-classes", scheduleId, "history", page],
		queryFn: () =>
			getMyClassHistory(scheduleId, { limit: HISTORY_LIMIT, offset }),
		enabled: validId,
	});

	const filesQuery = useQuery({
		queryKey: ["my-classes", scheduleId, "files"],
		queryFn: () => listMyClassFiles(scheduleId),
		enabled: validId,
	});

	const downloadMutation = useMutation({
		mutationFn: (file: ClassFileRead) =>
			downloadMyClassFile(scheduleId, file.id),
		onSuccess: (blob: Blob, file: ClassFileRead) => {
			downloadBlob(blob, file.original_filename);
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	if (!validId) {
		return <ErrorBanner message={t("error_messages.invalid_class_id")} />;
	}

	const summary = attendanceQuery.data;
	const lessons = historyQuery.data?.lessons ?? [];
	const historyTotal = historyQuery.data?.total ?? 0;
	const files = filesQuery.data ?? [];

	const stats: Array<{ label: string; value: string | number }> = summary
		? [
				{ label: "Expected sessions", value: summary.expected_sessions },
				{ label: "Attended sessions", value: summary.attended_sessions },
				{ label: "Absent sessions", value: summary.absent_sessions },
				{
					label: "Attendance rate",
					value: formatPercent(summary.attendance_rate, true),
				},
			]
		: [];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("classes.detail")}
				description={
					summary
						? `${summary.student_name_en} (${summary.student_name_ar})`
						: "Attendance and history for this class."
				}
				actions={
					<Button variant="outline" asChild>
						<Link href="/platform/dashboard/parent/classes">
							<ArrowLeft className="rtl:rotate-180 size-4" />
							Back to classes
						</Link>
					</Button>
				}
			/>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">
					{t("classes.attendance_summary")}
				</h2>
				{attendanceQuery.isLoading ? <LoadingSkeleton rows={2} /> : null}
				{attendanceQuery.isError ? (
					<ErrorBanner message={errorMessage(attendanceQuery.error)} />
				) : null}
				{attendanceQuery.isSuccess && summary ? (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{stats.map((stat) => (
							<Card key={stat.label}>
								<CardHeader>
									<CardTitle className="text-muted-foreground text-sm font-medium">
										{stat.label}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-2xl font-semibold">{stat.value}</p>
								</CardContent>
							</Card>
						))}
					</div>
				) : null}
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">{t("lessons.lesson_history")}</h2>
				{historyQuery.isLoading ? <LoadingSkeleton rows={5} /> : null}
				{historyQuery.isError ? (
					<ErrorBanner message={errorMessage(historyQuery.error)} />
				) : null}
				{historyQuery.isSuccess && lessons.length === 0 ? (
					<EmptyState
						title={t("classes.no_lessons_parent")}
						description={t("classes.no_lessons_parent_desc")}
					/>
				) : null}
				{historyQuery.isSuccess && lessons.length > 0 ? (
					<>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t("common.date")}</TableHead>
										<TableHead>{t("common.time")}</TableHead>
										<TableHead>{t("lessons.attendance")}</TableHead>
										<TableHead>{t("common.notes")}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{lessons.map((lesson: LessonRead) => (
										<TableRow key={lesson.id}>
											<TableCell>{formatDate(lesson.date)}</TableCell>
											<TableCell>
												{formatTime(lesson.start_time)} -{" "}
												{formatTime(lesson.end_time)}
											</TableCell>
											<TableCell>
												<AttendanceBadge status={lesson.attendance} />
											</TableCell>
											<TableCell className="max-w-[320px] whitespace-normal">
												{lesson.student_notes || lesson.homework ? (
													<div className="flex flex-col gap-1">
														{lesson.student_notes ? (
															<p>{lesson.student_notes}</p>
														) : null}
														{lesson.homework ? (
															<p className="text-muted-foreground text-xs">
																Homework: {lesson.homework}
															</p>
														) : null}
													</div>
												) : (
													<span className="text-muted-foreground">
														{t("common.no_notes")}
													</span>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
						<Pagination
							page={page}
							perPage={HISTORY_LIMIT}
							total={historyTotal}
							onChange={setPage}
						/>
					</>
				) : null}
			</section>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">{t("classes.files")}</h2>
				{filesQuery.isLoading ? <LoadingSkeleton rows={2} /> : null}
				{filesQuery.isError ? (
					<ErrorBanner message={errorMessage(filesQuery.error)} />
				) : null}
				{filesQuery.isSuccess && files.length === 0 ? (
					<EmptyState
						title={t("classes.no_files")}
						description={t("classes.no_files_desc")}
					/>
				) : null}
				{filesQuery.isSuccess && files.length > 0 ? (
					<ul className="flex flex-col gap-2">
						{files.map((file: ClassFileRead) => (
							<li
								key={file.id}
								className="bg-muted/50 flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
							>
								<div className="flex min-w-0 items-center gap-2">
									<FileText className="text-muted-foreground size-4 shrink-0" />
									<span className="truncate">{file.original_filename}</span>
									<span className="text-muted-foreground shrink-0 text-xs">
										{formatBytes(file.file_size_bytes)}
									</span>
									<span className="text-muted-foreground hidden shrink-0 text-xs sm:inline">
										{formatDateTime(file.created_at)}
									</span>
								</div>
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => downloadMutation.mutate(file)}
									disabled={downloadMutation.isPending}
									aria-label={`Download ${file.original_filename}`}
								>
									<Download className="size-4" />
								</Button>
							</li>
						))}
					</ul>
				) : null}
			</section>
		</div>
	);
}
