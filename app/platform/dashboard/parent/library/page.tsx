"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/api/client";
import { errorMessage } from "@/components/shared/error-text";
import { formatBytes } from "@/lib/format";
import { useLocalization } from "@/lib/localization-context";
import {
	downloadMyLibraryFile,
	listMyLibrary,
	listMyLibraryFiles,
} from "@/lib/api/library";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	BookOpen,
	Download,
	ExternalLink,
	FileText,
	FolderOpen,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import type { LibraryAccessLevel, LibraryFileRead, LibraryItemRead } from "@/lib/data-contracts";
import { BadgeVariant, StatusBadge } from "@/components/shared/status-badge";

const PER_PAGE = 12;

const accessVariant: Record<LibraryAccessLevel, BadgeVariant> = {
	all_students: "success",
	specific_students: "warning",
	groups: "secondary",
};

const accessLabel: Record<LibraryAccessLevel, string> = {
	all_students: "All students",
	specific_students: "Specific students",
	groups: "Groups",
};

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

function thumbnailSrc(path: string | null): string | undefined {
	if (!path) {
		return undefined;
	}
	if (/^https?:\/\//i.test(path)) {
		return path;
	}
	const url = `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
	try {
		return new URL(url).toString();
	} catch {
		return undefined;
	}
}

export default function ParentLibraryPage() {
	const { t } = useLocalization();
	const [page, setPage] = useState(1);
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const [thumbnailFailed, setThumbnailFailed] = useState(false);

	const itemsQuery = useQuery({
		queryKey: ["my-library", page],
		queryFn: () => listMyLibrary({ page, perPage: PER_PAGE }),
	});

	const filesQuery = useQuery({
		queryKey: ["my-library", expandedId, "files"],
		queryFn: async () => {
			if (expandedId === null) {
				return [];
			}
			return listMyLibraryFiles(expandedId);
		},
		enabled: expandedId !== null,
	});

	const downloadMutation = useMutation({
		mutationFn: (file: LibraryFileRead) =>
			downloadMyLibraryFile(file.library_item_id, file.id),
		onSuccess: (blob: Blob, file: LibraryFileRead) => {
			downloadBlob(blob, file.original_filename);
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	const items = itemsQuery.data?.items ?? [];
	const total = itemsQuery.data?.total ?? 0;

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("library.title")}
				description={t("library.parent_desc")}
				actions={
					<Button
						variant="outline"
						size="sm"
						onClick={() => setExpandedId(null)}
						disabled={expandedId === null}
					>
						{t("library.collapse_files")}
					</Button>
				}
			/>
			{itemsQuery.isLoading ? <LoadingSkeleton rows={5} /> : null}
			{itemsQuery.isError ? (
				<ErrorBanner message={errorMessage(itemsQuery.error)} />
			) : null}
			{itemsQuery.isSuccess && items.length === 0 ? (
				<EmptyState
					icon={BookOpen}
					title={t("library.no_items")}
					description={t("library.parent_no_items")}
				/>
			) : null}
			{itemsQuery.isSuccess && items.length > 0 ? (
				<>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{items.map((item: LibraryItemRead) => {
							const expanded = expandedId === item.id;
							const thumbnail = thumbnailSrc(item.thumbnail_image_path);
							return (
								<Card key={item.id} className="gap-4">
									<CardContent className="flex flex-1 flex-col gap-3">
										{thumbnail && !thumbnailFailed ? (
											<div className="bg-muted relative h-40 w-full overflow-hidden rounded-md">
												<Image
													src={thumbnail}
													alt={item.title}
													fill
													sizes="(max-width: 1024px) 50vw, 33vw"
													className="object-cover"
													onError={() => setThumbnailFailed(true)}
												/>
											</div>
										) : (
											<div className="bg-muted flex h-40 w-full items-center justify-center rounded-md">
												<BookOpen className="text-muted-foreground size-8" />
											</div>
										)}
										<h3 className="font-semibold leading-snug">{item.title}</h3>
										{item.description ? (
											<p className="text-muted-foreground text-sm">
												{item.description}
											</p>
										) : null}
										<div className="flex flex-wrap gap-2 pt-1">
											{item.category ? (
												<StatusBadge variant="secondary">{item.category}</StatusBadge>
											) : null}
											<StatusBadge variant={accessVariant[item.access_level]}>
												{accessLabel[item.access_level]}
											</StatusBadge>
										</div>
										<div className="flex flex-wrap gap-2">
											<Button variant="outline" size="sm" asChild>
												<a
													href={item.external_url}
													target="_blank"
													rel="noopener noreferrer"
												>
													<ExternalLink className="size-4" />
													{t("library.open_resource")}
												</a>
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => setExpandedId(expanded ? null : item.id)}
											>
												<FolderOpen className="size-4" />
												{expanded
													? t("library.hide_files")
													: t("library.files")}
											</Button>
										</div>
										{expanded ? (
											<div className="flex flex-col gap-2">
												{filesQuery.isLoading ? (
													<LoadingSkeleton rows={2} />
												) : null}
												{filesQuery.isError ? (
													<ErrorBanner
														message={errorMessage(filesQuery.error)}
													/>
												) : null}
												{!filesQuery.isLoading &&
													!filesQuery.isError &&
													(filesQuery.data ?? []).length === 0 ? (
													<p className="text-muted-foreground text-sm">
														{t("library.no_files_item")}
													</p>
												) : null}
												{!filesQuery.isLoading &&
													!filesQuery.isError &&
													(filesQuery.data ?? []).map((file: LibraryFileRead) => (
														<div
															key={file.id}
															className="bg-muted/50 flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
														>
															<div className="flex min-w-0 items-center gap-2">
																<FileText className="text-muted-foreground size-4 shrink-0" />
																<span className="truncate">
																	{file.original_filename}
																</span>
																<span className="text-muted-foreground shrink-0 text-xs">
																	{formatBytes(file.file_size_bytes)}
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
														</div>
													))}
											</div>
										) : null}
									</CardContent>
								</Card>
							);
						})}
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
