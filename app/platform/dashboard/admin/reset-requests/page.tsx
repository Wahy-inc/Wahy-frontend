"use client";
import { useLocalization } from "@/lib/localization-context";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyCodeDialog } from "@/components/shared/copy-code-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { ResetRequestStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	approveResetRequest,
	listResetRequests,
	rejectResetRequest,
} from "@/lib/api/auth";
import { errorMessage } from "@/components/shared/error-text";
import { formatDateTime } from "@/lib/dates";
import { ResetRequestRead, ResetRequestStatus } from "@/lib/data-contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusOptions: { value: ResetRequestStatus | "all"; labelKey: string }[] =
	[
		{ value: "all", labelKey: "common.all" },
		{ value: ResetRequestStatus.Pending, labelKey: "reset_requests.pending" },
		{ value: ResetRequestStatus.Approved, labelKey: "reset_requests.approved" },
		{ value: ResetRequestStatus.Rejected, labelKey: "reset_requests.rejected" },
		{
			value: ResetRequestStatus.Completed,
			labelKey: "reset_requests.completed",
		},
		{ value: ResetRequestStatus.Expired, labelKey: "reset_requests.expired" },
	];

export default function ResetRequestsPage() {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [status, setStatus] = useState<ResetRequestStatus | "all">("all");
	const [code, setCode] = useState<{ code: string; expires_at: string } | null>(
		null,
	);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["reset-requests", { status }],
		queryFn: () => listResetRequests(status === "all" ? null : status),
	});

	const approveMutation = useMutation({
		mutationFn: (requestId: number) => approveResetRequest(requestId),
		onSuccess: (data: { code: string; expires_at: string }) => {
			setCode({ code: data.code, expires_at: data.expires_at });
			toast.success(t("reset_requests.approved_success"));
			void queryClient.invalidateQueries({ queryKey: ["reset-requests"] });
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	const rejectMutation = useMutation({
		mutationFn: (requestId: number) => rejectResetRequest(requestId),
		onSuccess: () => {
			toast.success(t("reset_requests.rejected_success"));
			void queryClient.invalidateQueries({ queryKey: ["reset-requests"] });
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	const requests = data ?? [];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("reset_requests.title")}
				description={t("reset_requests.description")}
				actions={
					<div className="flex items-center gap-2">
						<Label htmlFor="reset-status" className="sr-only">
							{t("common.status")}
						</Label>
						<Select
							value={status}
							onValueChange={(value) =>
								setStatus(value as ResetRequestStatus | "all")
							}
						>
							<SelectTrigger id="reset-status" className="w-40">
								<SelectValue />
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
				}
			/>
			{isLoading ? <LoadingSkeleton rows={8} /> : null}
			{isError ? <ErrorBanner message={errorMessage(error)} /> : null}
			{!isLoading && !isError && requests.length === 0 ? (
				<EmptyState
					title={t("reset_requests.no_requests")}
					description={t("reset_requests.no_requests_desc")}
				/>
			) : null}
			{!isLoading && !isError && requests.length > 0 ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("reset_requests.identifier")}</TableHead>
							<TableHead>{t("common.status")}</TableHead>
							<TableHead>{t("reset_requests.created")}</TableHead>
							<TableHead>{t("reset_requests.resolved")}</TableHead>
							<TableHead className="text-end">{t("common.actions")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{requests.map((request: ResetRequestRead) => (
							<TableRow key={request.id}>
								<TableCell className="font-medium">
									{request.identifier_used}
								</TableCell>
								<TableCell>
									<ResetRequestStatusBadge
										status={request.status as ResetRequestStatus}
									/>
								</TableCell>
								<TableCell>{formatDateTime(request.created_at)}</TableCell>
								<TableCell>{formatDateTime(request.resolved_at)}</TableCell>
								<TableCell className="text-end">
									{request.status === ResetRequestStatus.Pending ? (
										<div className="flex items-center justify-end gap-2">
											<Button
												size="sm"
												disabled={approveMutation.isPending}
												onClick={() => approveMutation.mutate(request.id)}
											>
												<Check className="size-4" />
												{t("students.approve")}
											</Button>
											<ConfirmDialog
												title={t("reset_requests.reject_title")}
												description={t("reset_requests.reject_desc")}
												confirmLabel="Reject"
												destructive
												onConfirm={() => rejectMutation.mutate(request.id)}
												trigger={
													<Button
														variant="outline"
														size="sm"
														disabled={rejectMutation.isPending}
													>
														<X className="size-4" />
														{t("students.reject")}
													</Button>
												}
											/>
										</div>
									) : null}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : null}

			<CopyCodeDialog
				open={code !== null}
				onOpenChange={(open) => {
					if (!open) {
						setCode(null);
					}
				}}
				title={t("reset_requests.code_title")}
				description={t("reset_requests.code_desc")}
				code={code?.code ?? ""}
				expiresAt={code ? formatDateTime(code.expires_at) : undefined}
				expiresLabel={t("common.expires")}
			/>
		</div>
	);
}
