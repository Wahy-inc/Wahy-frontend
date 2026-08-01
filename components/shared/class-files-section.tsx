"use client";
import { useLocalization } from "@/lib/localization-context";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { downloadBlob } from "@/components/shared/download-blob";
import { ErrorBanner } from "@/components/shared/error-banner";
import { errorMessage } from "@/components/shared/error-text";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
	deleteClassFile,
	downloadClassFile,
	listClassFiles,
	uploadClassFile,
} from "@/lib/api/classFiles";
import type { ClassFileRead } from "@/lib/data-contracts";
import { formatDateTime } from "@/lib/dates";
import { formatBytes } from "@/lib/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ClassFilesSection({ scheduleId }: { scheduleId: number }) {
	const { t } = useLocalization();
	const queryClient = useQueryClient();

	const filesQuery = useQuery({
		queryKey: ["class-files", scheduleId],
		queryFn: () => listClassFiles(scheduleId),
	});

	const uploadMutation = useMutation({
		mutationFn: (file: File) => uploadClassFile(scheduleId, file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["class-files", scheduleId] });
			toast.success(t("file_upload.uploaded"));
		},
		onError: (err) => toast.error(errorMessage(err)),
	});

	const downloadMutation = useMutation({
		mutationFn: (file: ClassFileRead) =>
			downloadClassFile(scheduleId, file.id).then((blob) => ({ blob, file })),
		onSuccess: ({ blob, file }) => downloadBlob(blob, file.original_filename),
		onError: (err) => toast.error(errorMessage(err)),
	});

	const deleteMutation = useMutation({
		mutationFn: (fileId: number) => deleteClassFile(scheduleId, fileId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["class-files", scheduleId] });
			toast.success(t("file_upload.deleted"));
		},
		onError: (err) => toast.error(errorMessage(err)),
	});

	const files = filesQuery.data ?? [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="size-4" />
					Class files
				</CardTitle>
				<CardDescription>
					Files shared with this class (worksheets, recordings, ...).
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex flex-col gap-1.5">
					<Label>Upload a file</Label>
					<Input
						type="file"
						disabled={uploadMutation.isPending}
						onChange={(event) => {
							const file = event.target.files?.[0];
							if (file) {
								uploadMutation.mutate(file);
							}
							event.target.value = "";
						}}
					/>
				</div>
				{filesQuery.error ? (
					<ErrorBanner message={errorMessage(filesQuery.error)} />
				) : null}
				{filesQuery.isLoading ? (
					<LoadingSkeleton rows={2} />
				) : files.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						No files uploaded yet.
					</p>
				) : (
					<ul className="flex flex-col divide-y">
						{files.map((file) => (
							<li
								key={file.id}
								className="flex items-center justify-between gap-3 py-2"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium">
										{file.original_filename}
									</p>
									<p className="text-muted-foreground text-xs">
										{formatBytes(file.file_size_bytes)} -{" "}
										{formatDateTime(file.created_at)}
									</p>
								</div>
								<div className="flex shrink-0 items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => downloadMutation.mutate(file)}
										aria-label={t("library.download_file_aria")}
									>
										<Download className="size-4" />
									</Button>
									<ConfirmDialog
										trigger={
											<Button
												variant="ghost"
												size="icon"
												aria-label={t("library.delete_file_aria")}
											>
												<Trash2 className="size-4" />
											</Button>
										}
										title={t("library.delete_file_aria")}
										description={`Delete ${file.original_filename}?`}
										confirmLabel={t("common.delete")}
										destructive
										onConfirm={() => deleteMutation.mutate(file.id)}
									/>
								</div>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
