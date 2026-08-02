"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { errorMessage } from "@/components/shared/error-text";
import { formatDate, formatTime } from "@/lib/dates";
import { listMyClasses } from "@/lib/api/classes";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useChildFilter } from "../child-filter";
import { ClassGroupItem } from "@/lib/data-contracts";

export default function ParentClassesPage() {
	const { t } = useLocalization();
	const { studentId, childSelect } = useChildFilter();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["my-classes", studentId ?? "all"],
		queryFn: () => listMyClasses({ studentId }),
	});

	const classes = data?.classes ?? [];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("lessons.title")}
				description={t("classes.parent_desc")}
				actions={childSelect}
			/>
			{isLoading ? <LoadingSkeleton rows={5} /> : null}
			{isError ? <ErrorBanner message={errorMessage(error)} /> : null}
			{!isLoading && !isError && classes.length === 0 ? (
				<EmptyState
					icon={BookOpen}
					title={t("classes.no_classes_parent")}
					description={t("classes.no_classes_parent_desc")}
				/>
			) : null}
			{!isLoading && !isError && classes.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{classes.map((item: ClassGroupItem) => (
						<Link
							key={item.schedule_id}
							href={`/platform/dashboard/parent/classes/${item.schedule_id}`}
							className="block"
						>
							<Card className="h-full transition-colors hover:border-primary/50">
								<CardHeader>
									<CardTitle>{item.student_name_en}</CardTitle>
									<p className="text-muted-foreground text-sm">{item.student_name_ar}</p>
								</CardHeader>
								<CardContent className="flex flex-col gap-2 text-sm">
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("classes.day_time")}</span>
										<span>
											{item.day_label}, {formatTime(item.start_time)} - {formatTime(item.end_time)}
										</span>
									</div>
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("classes.next_session")}</span>
										<span>{formatDate(item.next_occurrence) || "Not scheduled"}</span>
									</div>
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("lessons.total_lessons")}</span>
										<span>{item.total_lessons}</span>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			) : null}
		</div>
	);
}
