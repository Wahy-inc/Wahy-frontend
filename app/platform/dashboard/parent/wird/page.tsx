"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { errorMessage } from "@/components/shared/error-text";
import { FieldTextarea } from "@/components/shared/field-textarea";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { WirdStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import { completeWirdAssignment, listMyWirdAssignments } from "@/lib/api/wird";
import { formatDate, formatDateTime } from "@/lib/dates";
import { useLocalization } from "@/lib/localization-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState } from "react";
import { useChildFilter } from "../child-filter";
import {
	wirdCompletionSchema,
	type WirdCompletionValues,
} from "@/app/platform/lib/schemas/wird";
import { WirdAssignmentStatus } from "@/lib/data-contracts";
import type { WirdAssignmentRead } from "@/lib/data-contracts";

const statusOptions: Array<{ value: string; labelKey: string }> = [
	{ value: "all", labelKey: "wird.all_statuses" },
	{ value: WirdAssignmentStatus.Assigned, labelKey: "wird.assigned" },
	{
		value: WirdAssignmentStatus.CompletedByStudent,
		labelKey: "wird.completed",
	},
	{ value: WirdAssignmentStatus.VerifiedBySheikh, labelKey: "wird.verified" },
	{ value: WirdAssignmentStatus.NeedsRetry, labelKey: "wird.needs_retry" },
	{ value: WirdAssignmentStatus.Cancelled, labelKey: "wird.cancelled" },
];

function formatAyahRange(assignment: WirdAssignmentRead): string {
	if (!assignment.surah_name) {
		return "";
	}
	if (assignment.ayah_from === null || assignment.ayah_to === null) {
		return assignment.surah_name;
	}
	if (assignment.ayah_from === assignment.ayah_to) {
		return `${assignment.surah_name} ${assignment.ayah_from}`;
	}
	return `${assignment.surah_name} ${assignment.ayah_from} - ${assignment.ayah_to}`;
}

function SubmitWirdDialog({
	assignment,
	onSubmitted,
}: {
	assignment: WirdAssignmentRead;
	onSubmitted: () => void;
}) {
	const [open, setOpen] = useState(false);
	const { t } = useLocalization();
	const form = useForm<WirdCompletionValues>({
		resolver: useZodResolver(wirdCompletionSchema),
		defaultValues: { submitted_notes: "" },
	});

	const mutation = useMutation({
		mutationFn: (values: WirdCompletionValues) =>
			completeWirdAssignment(assignment.id, values),
		onSuccess: () => {
			toast.success(t("wird.submitted_success"));
			setOpen(false);
			form.reset();
			onSubmitted();
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm">{t("wird.submit_completion")}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("wird.submit_completion")}</DialogTitle>
					<DialogDescription>
						{t("wird.completed_desc", { title: assignment.title })}
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col gap-4"
					onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
				>
					<FieldTextarea
						label={t("wird.notes_optional")}
						placeholder={t("wird.completion_notes_placeholder")}
						error={form.formState.errors.submitted_notes?.message}
						{...form.register("submitted_notes")}
					/>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={mutation.isPending}>
							{mutation.isPending ? t("wird.submitting") : t("common.submit")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function ParentWirdPage() {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [status, setStatus] = useState("all");
	const { studentId, childSelect, children } = useChildFilter();
	const childNameById = new Map(
		children.map((child) => [child.id, child.full_name_english]),
	);

	const {
		data = [],
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["my-wird", studentId ?? "all", status],
		queryFn: () =>
			listMyWirdAssignments({
				studentId,
				status: status === "all" ? null : (status as WirdAssignmentStatus),
			}),
	});

	const handleSubmitted = () => {
		void queryClient.invalidateQueries({ queryKey: ["my-wird"] });
	};

	return (
		<div className="flex flex-col gap-6">
			<PageHeader title={t("wird.title")} description={t("wird.parent_desc")} />
			<div className="flex flex-wrap items-center gap-3">
				{childSelect}
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger
						className="w-45"
						aria-label={t("wird.filter_status_aria")}
					>
						<SelectValue placeholder={t("wird.all_statuses")} />
					</SelectTrigger>
					<SelectContent>
						{statusOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{t(option.labelKey)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			{isLoading ? <LoadingSkeleton rows={4} /> : null}
			{isError ? <ErrorBanner message={errorMessage(error)} /> : null}
			{!isLoading && !isError && data.length === 0 ? (
				<EmptyState
					icon={ScrollText}
					title={t("wird.no_assignments")}
					description={t("wird.no_assignments_parent_desc")}
				/>
			) : null}
			{!isLoading && !isError && data.length > 0 ? (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{data.map((assignment: WirdAssignmentRead) => {
						const ayahRange = formatAyahRange(assignment);
						return (
							<Card key={assignment.id}>
								<CardHeader className="gap-2">
									<CardTitle className="flex items-start justify-between gap-3">
										<span className="min-w-0">{assignment.title}</span>
										<WirdStatusBadge status={assignment.status} />
									</CardTitle>
									{studentId === undefined ? (
										<p className="text-muted-foreground text-sm">
											{childNameById.get(assignment.student_id) ??
												t("wird.student_number", { id: assignment.student_id })}
										</p>
									) : null}
								</CardHeader>
								<CardContent className="flex flex-col gap-2 text-sm">
									{ayahRange ? (
										<p className="text-muted-foreground">{ayahRange}</p>
									) : null}
									{assignment.due_date ? (
										<div className="flex items-center justify-between gap-3">
											<span className="text-muted-foreground">
												{t("wird.due")}
											</span>
											<span>{formatDate(assignment.due_date)}</span>
										</div>
									) : null}
									{assignment.notes ? (
										<div className="flex items-start justify-between gap-3">
											<span className="text-muted-foreground">
												{t("common.notes")}
											</span>
											<span className="text-end">{assignment.notes}</span>
										</div>
									) : null}
									{assignment.completed_at ? (
										<div className="flex items-center justify-between gap-3">
											<span className="text-muted-foreground">
												{t("wird.completed")}
											</span>
											<span>{formatDateTime(assignment.completed_at)}</span>
										</div>
									) : null}
									{assignment.verified_at ? (
										<div className="flex items-center justify-between gap-3">
											<span className="text-muted-foreground">
												{t("wird.reviewed")}
											</span>
											<span>{formatDateTime(assignment.verified_at)}</span>
										</div>
									) : null}
									{assignment.verification_notes ? (
										<p className="bg-muted/50 rounded-md border px-3 py-2 text-xs">
											{t("wird.sheikh_feedback", {
												notes: assignment.verification_notes,
											})}
										</p>
									) : null}
									{assignment.status === WirdAssignmentStatus.Assigned ? (
										<SubmitWirdDialog
											assignment={assignment}
											onSubmitted={handleSubmitted}
										/>
									) : null}
								</CardContent>
							</Card>
						);
					})}
				</div>
			) : null}
		</div>
	);
}
