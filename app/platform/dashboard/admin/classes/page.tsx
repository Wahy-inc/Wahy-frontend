"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { listClasses } from "@/lib/api/classes";
import { formatDate, formatTime } from "@/lib/dates";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { ClassGroupItem } from "@/lib/data-contracts";

export default function AdminClassesPage() {
	const { t } = useLocalization();
	const { data, isLoading, error } = useQuery({
		queryKey: ["classes"],
		queryFn: listClasses,
	});

	const classes = data?.classes ?? [];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("lessons.title")}
				description={t("classes.description")}
			/>
			{error ? (
				<ErrorBanner message={error instanceof Error ? error.message : t("common.something_went_wrong")} />
			) : null}
			{isLoading ? (
				<LoadingSkeleton rows={6} />
			) : classes.length === 0 ? (
				<EmptyState
					icon={BookOpen}
					title={t("classes.no_classes")}
					description={t("classes.no_classes_desc")}
				/>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					{classes.map((item: ClassGroupItem) => (
						<Link
							key={item.schedule_id}
							href={`/platform/dashboard/admin/classes/${item.schedule_id}`}
							className="bg-card text-card-foreground hover:bg-accent flex flex-col gap-3 rounded-xl border p-6 shadow-sm transition-colors"
						>
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="truncate font-medium">{item.student_name_en}</p>
									<p className="text-muted-foreground truncate text-sm" dir="rtl">
										{item.student_name_ar}
									</p>
								</div>
								{item.is_active ? (
									<StatusBadge variant="success">{t("schedules.active")}</StatusBadge>
								) : (
									<StatusBadge variant="secondary">{t("schedules.inactive")}</StatusBadge>
								)}
							</div>
							<p className="text-sm">
								{item.day_label} - {formatTime(item.start_time)} to {formatTime(item.end_time)}
							</p>
							<p className="text-muted-foreground text-sm">
								{item.next_occurrence
									? `Next: ${formatDate(item.next_occurrence)}`
									: t("classes.no_upcoming")}
							</p>
							<p className="text-muted-foreground text-sm">
								{item.total_lessons} lessons recorded
							</p>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
