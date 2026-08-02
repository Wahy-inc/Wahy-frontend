"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { errorMessage } from "@/components/shared/error-text";
import { listParents } from "@/lib/api/parents";
import { useQuery } from "@tanstack/react-query";
import { Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ParentRead } from "@/lib/data-contracts";

const PER_PAGE = 20;

export default function ParentsPage() {
	const { t } = useLocalization();
	const router = useRouter();
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setSearch(searchInput);
			setPage(1);
		}, 300);
		return () => window.clearTimeout(timer);
	}, [searchInput]);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["parents", { search, page, perPage: PER_PAGE }],
		queryFn: () => listParents({ search, page, perPage: PER_PAGE }),
	});

	const parents = data?.items ?? [];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("parents.title")}
				description={t("parents.description")}
				actions={
					<Button asChild>
						<Link href="/platform/dashboard/admin/parents/new">
							<UserPlus className="size-4" />
							{t("parents.new_parent")}
						</Link>
					</Button>
				}
			/>
			<div className="relative max-w-sm">
				<Search className="text-muted-foreground absolute top-1/2 inset-s-3 size-4 -translate-y-1/2" />
				<Input
					type="search"
					placeholder={t("parents.search_placeholder")}
					aria-label={t("parents.search_aria")}
					className="ps-9"
					value={searchInput}
					onChange={(event) => setSearchInput(event.target.value)}
				/>
			</div>
			{isLoading ? <LoadingSkeleton rows={8} /> : null}
			{isError ? <ErrorBanner message={errorMessage(error)} /> : null}
			{!isLoading && !isError && parents.length === 0 ? (
				<EmptyState
					title={t("parents.no_parents_found")}
					description={
						search
							? "Try a different search term."
							: "Create your first parent to get started."
					}
				/>
			) : null}
			{!isLoading && !isError && parents.length > 0 ? (
				<>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t("common.name")}</TableHead>
								<TableHead>{t("common.email")}</TableHead>
								<TableHead>{t("common.phone")}</TableHead>
								<TableHead>{t("parents.children")}</TableHead>
								<TableHead>{t("common.status")}</TableHead>
								<TableHead className="text-end">
									{t("common.actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{parents.map((parent: ParentRead) => (
								<TableRow
									key={parent.id}
									className="cursor-pointer"
									onClick={() =>
										router.push(
											`/platform/dashboard/admin/parents/${parent.id}`,
										)
									}
								>
									<TableCell className="font-medium">
										{parent.full_name}
									</TableCell>
									<TableCell>{parent.email}</TableCell>
									<TableCell>{parent.phone ?? "—"}</TableCell>
									<TableCell>{parent.child_count}</TableCell>
									<TableCell>
										{parent.is_active ? (
											<StatusBadge variant="success">
												{t("schedules.active")}
											</StatusBadge>
										) : (
											<StatusBadge variant="outline">
												{t("parents.not_activated")}
											</StatusBadge>
										)}
									</TableCell>
									<TableCell className="text-end">
										<Button
											variant="ghost"
											size="sm"
											onClick={(event) => {
												event.stopPropagation();
												router.push(
													`/platform/dashboard/admin/parents/${parent.id}`,
												);
											}}
										>
											{t("common.view")}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Pagination
						page={page}
						perPage={PER_PAGE}
						total={data?.total ?? 0}
						onChange={setPage}
					/>
				</>
			) : null}
		</div>
	);
}
