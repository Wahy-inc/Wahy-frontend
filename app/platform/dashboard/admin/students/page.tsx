"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StudentStatusBadge } from "@/components/shared/status-badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api/client";
import { listStudents } from "@/lib/api/students";
import { StudentStatus } from "@/lib/data-contracts";
import { formatCurrency } from "@/lib/format";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PER_PAGE = 20;

const STATUS_ORDER = [
	StudentStatus.Active,
	StudentStatus.OnHold,
	StudentStatus.Graduated,
	StudentStatus.Inactive,
];

function errorMessage(error: unknown, t: (key: string) => string): string {
	return error instanceof ApiError ? error.message : t("common.something_went_wrong");
}

export default function StudentsPage() {
	const { t } = useLocalization();
	const router = useRouter();
	const [page, setPage] = useState(1);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["students", { page, perPage: PER_PAGE }],
		queryFn: () => listStudents({ page, perPage: PER_PAGE }),
	});

	const students = data?.items ?? [];
	const sections = STATUS_ORDER.map((status) => ({
		status,
		items: students.filter((student) => student.status === status),
	})).filter((section) => section.items.length > 0);

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("students.title")}
				description={t("students.description")}
			/>
			{isLoading ? <LoadingSkeleton rows={8} /> : null}
			{isError ? <ErrorBanner message={errorMessage(error, t)} /> : null}
			{!isLoading && !isError && students.length === 0 ? (
				<EmptyState
					title={t("students.no_students_found")}
					description={t("students.no_students_desc")}
				/>
			) : null}
			{!isLoading && !isError && sections.length > 0 ? (
				<div className="flex flex-col gap-8">
					{sections.map((section) => (
						<section key={section.status} className="flex flex-col gap-3">
							<div className="flex items-center gap-2">
								<StudentStatusBadge status={section.status} />
								<span className="text-muted-foreground text-sm">
									{section.items.length}
								</span>
							</div>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>{t("students.full_name")}</TableHead>
										<TableHead>{t("students.lessons_per_week")}</TableHead>
										<TableHead>{t("students.base_rate")}</TableHead>
										<TableHead>{t("common.notes")}</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{section.items.map((student) => (
										<TableRow
											key={student.id}
											className="cursor-pointer"
											onClick={() =>
												router.push(`/platform/dashboard/admin/students/${student.id}`)
											}
										>
											<TableCell>
												<p className="font-medium">{student.full_name_english}</p>
												<p className="text-muted-foreground text-sm" dir="rtl">
													{student.full_name_arabic}
												</p>
											</TableCell>
											<TableCell>{student.lessons_per_week}</TableCell>
											<TableCell>{formatCurrency(student.base_rate)}</TableCell>
											<TableCell>
												{student.private_notes ?? student.special_notes ?? "—"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</section>
					))}
					<Pagination page={page} perPage={PER_PAGE} total={data?.total ?? 0} onChange={setPage} />
				</div>
			) : null}
		</div>
	);
}
