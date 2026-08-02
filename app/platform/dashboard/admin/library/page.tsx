"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRef, useState, type ChangeEvent } from "react";
import { z } from "zod";
import {
	BookOpen,
	Download,
	ExternalLink,
	Eye,
	FileText,
	Library as LibraryIcon,
	Plus,
	Trash2,
	Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { FieldInput } from "@/components/shared/field-input";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import {
	StatusBadge,
	type BadgeVariant,
} from "@/components/shared/status-badge";
import { ApiError, BACKEND_URL } from "@/lib/api/client";
import {
	createLibraryItem,
	deactivateLibraryItem,
	deleteLibraryFile,
	downloadLibraryFile,
	listLibrary,
	listLibraryFiles,
	uploadLibraryFile,
} from "@/lib/api/library";
import { listStudents } from "@/lib/api/students";
import { formatBytes } from "@/lib/format";
import {
	libraryItemSchema,
	type LibraryItemValues,
} from "@/app/platform/lib/schemas/library";
import type {
	BodyCreateApiV1LibraryPost,
	LibraryAccessLevel,
	LibraryFileRead,
	LibraryItemRead,
	StudentRead,
} from "@/lib/data-contracts";

const PAGE_SIZE = 12;
const STUDENTS_PAGE_SIZE = 100;

// Backend requires external_url; keep the pre-refactor default when the sheikh uploads files only.
const DEFAULT_LIBRARY_URL = "https://www.google.com/";

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

function errorText(err: unknown, t: (key: string) => string): string {
	return err instanceof ApiError
		? err.message
		: t("common.something_went_wrong");
}

function studentName(student: StudentRead): string {
	return student.full_name_english || student.full_name_arabic;
}

function thumbnailUrl(path: string | null): string | undefined {
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

interface LibraryCardProps {
	item: LibraryItemRead;
}

function LibraryCard({ item }: LibraryCardProps) {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [expanded, setExpanded] = useState(false);
	const [thumbnailFailed, setThumbnailFailed] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const thumbnail = thumbnailUrl(item.thumbnail_image_path);

	const filesQuery = useQuery({
		queryKey: ["library", item.id],
		queryFn: () => listLibraryFiles(item.id),
		enabled: expanded,
	});

	const uploadMutation = useMutation({
		mutationFn: (file: File) => uploadLibraryFile(item.id, file),
		onSuccess: () => {
			toast.success(t("file_upload.uploaded"));
			queryClient.invalidateQueries({ queryKey: ["library", item.id] });
		},
		onError: (err: unknown) => toast.error(errorText(err, t)),
	});

	const deleteFileMutation = useMutation({
		mutationFn: (fileId: number) => deleteLibraryFile(item.id, fileId),
		onSuccess: () => {
			toast.success(t("file_upload.deleted"));
			queryClient.invalidateQueries({ queryKey: ["library", item.id] });
		},
		onError: (err: unknown) => toast.error(errorText(err, t)),
	});

	const deleteItemMutation = useMutation({
		mutationFn: () => deactivateLibraryItem(item.id),
		onSuccess: () => {
			toast.success(t("library.deleted_success"));
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
		onError: (err: unknown) => toast.error(errorText(err, t)),
	});

	const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (file) {
			uploadMutation.mutate(file);
		}
	};

	const handleDownload = async (file: LibraryFileRead) => {
		try {
			const blob = await downloadLibraryFile(item.id, file.id);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = file.original_filename;
			a.click();
			URL.revokeObjectURL(url);
		} catch (err) {
			toast.error(errorText(err, t));
		}
	};

	return (
		<Card className="gap-4 py-5">
			<CardContent className="flex flex-col gap-3 px-5">
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

				<div className="flex flex-col gap-1">
					<div className="flex items-start justify-between gap-2">
						<h3 className="font-semibold leading-snug">{item.title}</h3>
						{item.external_url ? (
							<a
								href={item.external_url}
								target="_blank"
								rel="noreferrer"
								aria-label={t("library.open_external_aria")}
								className="text-muted-foreground hover:text-foreground"
							>
								<ExternalLink className="size-4" />
							</a>
						) : null}
					</div>
					{item.description ? (
						<p className="text-muted-foreground line-clamp-2 text-sm">
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
					<div className="text-muted-foreground flex items-center gap-4 text-xs">
						<span className="flex items-center gap-1">
							<Eye className="size-3.5" /> {item.view_count}
						</span>
						<span className="flex items-center gap-1">
							<Download className="size-3.5" /> {item.download_count}
						</span>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2 border-t pt-3">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setExpanded((prev) => !prev)}
					>
						<BookOpen className="size-4" />{" "}
						{expanded ? t("library.hide_files") : t("library.files")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						disabled={uploadMutation.isPending}
						onClick={() => fileInputRef.current?.click()}
					>
						<Upload className="size-4" />
						{uploadMutation.isPending
							? t("common.uploading")
							: t("library.upload_file")}
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						className="hidden"
						onChange={handleUpload}
					/>
					<div className="ms-auto">
						<ConfirmDialog
							title={t("library.delete_item_title")}
							description={`Remove "${item.title}"? Students will no longer see it.`}
							confirmLabel={t("common.delete")}
							destructive
							onConfirm={() => deleteItemMutation.mutate()}
							trigger={
								<Button
									variant="ghost"
									size="sm"
									aria-label={t("library.delete_item_aria")}
								>
									<Trash2 className="size-4" />
								</Button>
							}
						/>
					</div>
				</div>

				{expanded ? (
					<div className="flex flex-col gap-2 border-t pt-3">
						{filesQuery.isLoading ? (
							<p className="text-muted-foreground text-sm">
								{t("library.loading_files")}
							</p>
						) : null}
						{filesQuery.isError ? (
							<ErrorBanner message={t("error_messages.failed_load_files")} />
						) : null}
						{filesQuery.isSuccess && filesQuery.data.length === 0 ? (
							<p className="text-muted-foreground text-sm">
								{t("library.no_files")}
							</p>
						) : null}
						{filesQuery.data?.map((file: LibraryFileRead) => (
							<div
								key={file.id}
								className="bg-muted/50 flex items-center gap-3 rounded-md px-3 py-2 text-sm"
							>
								<FileText className="text-muted-foreground size-4 shrink-0" />
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">
										{file.original_filename}
									</p>
									<p className="text-muted-foreground text-xs">
										{formatBytes(file.file_size_bytes)} · {file.download_count}{" "}
										downloads
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label={`Download ${file.original_filename}`}
									onClick={() => void handleDownload(file)}
								>
									<Download className="size-4" />
								</Button>
								<ConfirmDialog
									title={t("library.delete_file_title")}
									description={`Delete "${file.original_filename}"?`}
									confirmLabel={t("common.delete")}
									destructive
									onConfirm={() => deleteFileMutation.mutate(file.id)}
									trigger={
										<Button
											variant="ghost"
											size="icon-sm"
											aria-label={`Delete ${file.original_filename}`}
										>
											<Trash2 className="size-4" />
										</Button>
									}
								/>
							</div>
						))}
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}

interface NewItemDialogProps {
	students: StudentRead[];
	onClose: () => void;
}

function NewItemDialog({ students, onClose }: NewItemDialogProps) {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [error, setError] = useState<string | null>(null);
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [studentIds, setStudentIds] = useState<number[]>([]);

	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm<z.input<typeof libraryItemSchema>, unknown, LibraryItemValues>({
		resolver: useZodResolver(libraryItemSchema),
		defaultValues: {
			title: "",
			external_url: "",
			description: "",
			category: "",
			access_level: "all_students",
		},
	});

	const accessLevel = watch("access_level");

	const createMutation = useMutation({
		mutationFn: (values: LibraryItemValues) => {
			const payload: BodyCreateApiV1LibraryPost = {
				title: values.title,
				external_url: values.external_url?.trim() || DEFAULT_LIBRARY_URL,
				description: values.description || null,
				category: values.category || null,
				access_level: values.access_level as LibraryAccessLevel,
				thumbnail,
				student_ids:
					values.access_level === "specific_students" && studentIds.length > 0
						? studentIds
						: null,
			};
			return createLibraryItem(payload);
		},
		onSuccess: () => {
			toast.success(t("library.created_success"));
			queryClient.invalidateQueries({ queryKey: ["library"] });
			onClose();
		},
		onError: (err: unknown) => setError(errorText(err, t)),
	});

	const toggleStudent = (id: number, checked: boolean) => {
		setStudentIds((prev) =>
			checked ? [...prev, id] : prev.filter((existing) => existing !== id),
		);
	};

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className="max-h-[85vh] overflow-y-auto">
				<form
					onSubmit={handleSubmit((values) => createMutation.mutate(values))}
					className="flex flex-col gap-4"
				>
					<DialogHeader>
						<DialogTitle>{t("library.new_item")}</DialogTitle>
						<DialogDescription>{t("library.new_item_desc")}</DialogDescription>
					</DialogHeader>
					{error ? <ErrorBanner message={error} /> : null}
					<FieldInput
						label={t("library.item_title")}
						required
						error={errors.title?.message}
						{...register("title")}
					/>
					<FieldInput
						label={t("library.url")}
						type="url"
						placeholder={t("library.url_placeholder")}
						error={errors.external_url?.message}
						{...register("external_url")}
					/>
					<FieldInput
						label={t("library.description")}
						error={errors.description?.message}
						{...register("description")}
					/>
					<FieldInput
						label={t("library.category")}
						placeholder={t("library.category_placeholder")}
						error={errors.category?.message}
						{...register("category")}
					/>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="access-level">{t("library.access_level")}</Label>
						<Controller
							control={control}
							name="access_level"
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger id="access-level" className="w-full">
										<SelectValue
											placeholder={t("library.select_access_level")}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all_students">
											{t("library.all_students")}
										</SelectItem>
										<SelectItem value="specific_students">
											{t("library.specific_students")}
										</SelectItem>
										<SelectItem value="groups">
											{t("library.groups")}
										</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					{accessLevel === "specific_students" ? (
						<div className="flex flex-col gap-2">
							<Label>{t("common.students")}</Label>
							<div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-md border p-3">
								{students.map((student) => (
									<label
										key={student.id}
										className="flex cursor-pointer items-center gap-2 text-sm"
									>
										<input
											type="checkbox"
											checked={studentIds.includes(student.id)}
											onChange={(event) =>
												toggleStudent(student.id, event.target.checked)
											}
											className="size-4 accent-primary"
										/>
										{studentName(student)}
									</label>
								))}
								{students.length === 0 ? (
									<p className="text-muted-foreground text-sm">
										{t("library.no_students_available")}
									</p>
								) : null}
							</div>
							{studentIds.length === 0 ? (
								<p className="text-muted-foreground text-xs">
									{t("library.none_selected_warning")}
								</p>
							) : null}
						</div>
					) : null}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="thumbnail">{t("library.thumbnail")}</Label>
						<Input
							id="thumbnail"
							type="file"
							accept="image/*"
							onChange={(event) =>
								setThumbnail(event.target.files?.[0] ?? null)
							}
						/>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending ? "Creating..." : "Create item"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminLibraryPage() {
	const { t } = useLocalization();
	const [page, setPage] = useState(1);
	const [createOpen, setCreateOpen] = useState(false);

	const libraryQuery = useQuery({
		queryKey: ["library", { page }],
		queryFn: () => listLibrary({ page, perPage: PAGE_SIZE }),
	});

	const studentsQuery = useQuery({
		queryKey: ["students"],
		queryFn: () => listStudents({ perPage: STUDENTS_PAGE_SIZE }),
	});

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("library.title")}
				description={t("library.description_short")}
				actions={
					<Button onClick={() => setCreateOpen(true)}>
						<Plus className="size-4" />
						{t("library.new_item")}
					</Button>
				}
			/>

			{libraryQuery.isLoading ? <LoadingSkeleton rows={4} /> : null}

			{libraryQuery.isError ? (
				<div className="flex flex-col items-start gap-3">
					<ErrorBanner message={errorText(libraryQuery.error, t)} />
					<Button variant="outline" onClick={() => void libraryQuery.refetch()}>
						{t("common.retry")}
					</Button>
				</div>
			) : null}

			{libraryQuery.isSuccess && libraryQuery.data.items.length === 0 ? (
				<EmptyState
					icon={LibraryIcon}
					title={t("library.no_items")}
					description={t("library.no_items_desc")}
				/>
			) : null}

			{libraryQuery.isSuccess && libraryQuery.data.items.length > 0 ? (
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{libraryQuery.data.items.map((item: LibraryItemRead) => (
							<LibraryCard key={item.id} item={item} />
						))}
					</div>
					<Pagination
						page={page}
						perPage={PAGE_SIZE}
						total={libraryQuery.data.total}
						onChange={setPage}
					/>
				</div>
			) : null}

			{createOpen ? (
				<NewItemDialog
					students={studentsQuery.data?.items ?? []}
					onClose={() => setCreateOpen(false)}
				/>
			) : null}
		</div>
	);
}
