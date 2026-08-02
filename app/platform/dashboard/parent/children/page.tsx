"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StudentStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { errorMessage } from "@/components/shared/error-text";
import { formatDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import { getMyChildren } from "@/lib/api/parents";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import Link from "next/link";
import type { StudentRead, StudentStatus } from "@/lib/data-contracts";

export default function ParentChildrenPage() {
	const { t } = useLocalization();
	const { data: children = [], isLoading, isError, error } = useQuery({
		queryKey: ["my-children"],
		queryFn: getMyChildren,
	});

	if (isLoading) {
		return <LoadingSkeleton rows={5} />;
	}
	if (isError) {
		return <ErrorBanner message={errorMessage(error)} />;
	}

	return (
		<div className="flex flex-col gap-6">
			<PageHeader title={t("children.title")} description={t("children.description")} />
			{children.length === 0 ? (
				<EmptyState
					icon={Users}
					title={t("children.no_children")}
					description={t("children.no_children_desc")}
				/>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{children.map((child: StudentRead) => (
						<Link
							key={child.id}
							href={`/platform/dashboard/parent/children/${child.id}`}
							className="block"
						>
							<Card className="h-full transition-colors hover:border-primary/50">
								<CardHeader>
									<CardTitle>{child.full_name_english}</CardTitle>
									<p className="text-muted-foreground text-sm">{child.full_name_arabic}</p>
								</CardHeader>
								<CardContent className="flex flex-col gap-2 text-sm">
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("common.status")}</span>
										<StudentStatusBadge status={child.status as StudentStatus} />
									</div>
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("students.date_of_birth")}</span>
										<span>{formatDate(child.date_of_birth) || "Not set"}</span>
									</div>
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("students.timezone")}</span>
										<span>{child.timezone}</span>
									</div>
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("students.lessons_per_week")}</span>
										<span>{child.lessons_per_week}</span>
									</div>
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("students.base_rate")}</span>
										<span>{formatCurrency(child.base_rate) || "Not set"}</span>
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
