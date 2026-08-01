"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, type ReactNode } from "react";
import {
	CheckCircle2,
	Download,
	FileText,
	XCircle,
	ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { downloadBlob } from "@/components/shared/download-blob";
import { errorMessage } from "@/components/shared/error-text";
import { FieldInput } from "@/components/shared/field-input";
import { FieldTextarea } from "@/components/shared/field-textarea";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import {
	InvoiceStatusBadge,
	StatusBadge,
} from "@/components/shared/status-badge";
import {
	cancelInvoice,
	downloadInvoicePdf,
	getInvoice,
	markInvoicePaid,
	overrideInvoiceItem,
} from "@/lib/api/invoices";
import { formatCurrency } from "@/lib/format";
import { formatDate, rangeLabel, todayISO } from "@/lib/dates";
import {
	invoiceOverrideSchema,
	invoicePaidSchema,
	type InvoiceOverrideValues,
	type InvoicePaidValues,
} from "@/app/platform/lib/schemas/invoice";
import type { InvoiceItemRead } from "@/lib/data-contracts";

function Meta({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-muted-foreground text-sm">{label}</span>
			<span className="font-medium">{value}</span>
		</div>
	);
}

interface MarkPaidDialogProps {
	invoiceId: number;
	onClose: () => void;
	onSuccess: () => void;
}

function MarkPaidDialog({
	invoiceId,
	onClose,
	onSuccess,
}: MarkPaidDialogProps) {
	const { t } = useLocalization();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InvoicePaidValues>({
		resolver: useZodResolver(invoicePaidSchema),
		defaultValues: {
			paid_date: todayISO(),
			payment_method: "",
			payment_reference: "",
			payment_notes: "",
		},
	});

	const paidMutation = useMutation({
		mutationFn: (values: InvoicePaidValues) =>
			markInvoicePaid(invoiceId, {
				paid_date: values.paid_date,
				payment_method: values.payment_method || null,
				payment_reference: values.payment_reference || null,
				payment_notes: values.payment_notes || null,
			}),
		onSuccess: () => {
			toast.success(t("invoices.mark_paid_success"));
			onSuccess();
			onClose();
		},
		onError: (err) => setError(errorMessage(err)),
	});

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent>
				<form
					onSubmit={handleSubmit((values) => paidMutation.mutate(values))}
					className="flex flex-col gap-4"
				>
					<DialogHeader>
						<DialogTitle>{t("invoices.mark_invoice_as_paid")}</DialogTitle>
						<DialogDescription>
							{t("invoices.mark_paid_desc")}
						</DialogDescription>
					</DialogHeader>
					{error ? <ErrorBanner message={error} /> : null}
					<FieldInput
						label={t("invoices.paid_date")}
						type="date"
						required
						error={errors.paid_date?.message}
						{...register("paid_date")}
					/>
					<FieldInput
						label={t("invoices.payment_method")}
						placeholder={t("invoices.payment_method_placeholder")}
						error={errors.payment_method?.message}
						{...register("payment_method")}
					/>
					<FieldInput
						label={t("invoices.payment_reference")}
						placeholder={t("invoices.payment_reference_placeholder")}
						error={errors.payment_reference?.message}
						{...register("payment_reference")}
					/>
					<FieldInput
						label={t("invoices.payment_notes")}
						error={errors.payment_notes?.message}
						{...register("payment_notes")}
					/>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={paidMutation.isPending}>
							{paidMutation.isPending ? t("common.saving") : "Mark paid"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface OverrideDialogProps {
	item: InvoiceItemRead;
	onClose: () => void;
	onSuccess: () => void;
}

function OverrideDialog({ item, onClose, onSuccess }: OverrideDialogProps) {
	const { t } = useLocalization();
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InvoiceOverrideValues>({
		resolver: useZodResolver(invoiceOverrideSchema),
		defaultValues: { billable: item.billable, override_reason: "" },
	});

	const overrideMutation = useMutation({
		mutationFn: (values: InvoiceOverrideValues) =>
			overrideInvoiceItem(item.invoice_id, {
				item_id: item.id,
				billable: values.billable,
				override_reason: values.override_reason,
			}),
		onSuccess: () => {
			toast.success(t("invoices.line_item_updated"));
			onSuccess();
			onClose();
		},
		onError: (err) => setError(errorMessage(err)),
	});

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent>
				<form
					onSubmit={handleSubmit((values) => overrideMutation.mutate(values))}
					className="flex flex-col gap-4"
				>
					<DialogHeader>
						<DialogTitle>{t("invoices.override_invoice")}</DialogTitle>
						<DialogDescription>{item.description}</DialogDescription>
					</DialogHeader>
					{error ? <ErrorBanner message={error} /> : null}
					<label className="flex items-center gap-2 text-sm">
						<input
							type="checkbox"
							{...register("billable")}
							className="size-4 accent-primary"
						/>
						{t("invoices.billable")}
					</label>
					<FieldTextarea
						label="Override reason"
						required
						placeholder={t("invoices.override_reason_placeholder")}
						error={errors.override_reason?.message}
						{...register("override_reason")}
					/>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={overrideMutation.isPending}>
							{overrideMutation.isPending
								? t("common.saving")
								: t("invoices.save_override")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminInvoiceDetailPage() {
	const { t } = useLocalization();
	const params = useParams<{ invoiceId: string }>();
	const invoiceId = Number(params.invoiceId);
	const queryClient = useQueryClient();
	const [paidOpen, setPaidOpen] = useState(false);
	const [overrideItem, setOverrideItem] = useState<InvoiceItemRead | null>(
		null,
	);

	const invoiceQuery = useQuery({
		queryKey: ["invoices", invoiceId],
		queryFn: () => getInvoice(invoiceId),
		enabled: Number.isFinite(invoiceId),
	});

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["invoices", invoiceId] });
		queryClient.invalidateQueries({ queryKey: ["invoices"] });
	};

	const cancelMutation = useMutation({
		mutationFn: () => cancelInvoice(invoiceId),
		onSuccess: () => {
			toast.success(t("invoices.cancelled_success"));
			invalidate();
		},
		onError: (err) => toast.error(errorMessage(err)),
	});

	const handleDownloadPdf = async () => {
		try {
			const blob = await downloadInvoicePdf(invoiceId);
			downloadBlob(blob, "invoice.pdf");
		} catch (err) {
			toast.error(errorMessage(err));
		}
	};

	if (invoiceQuery.isLoading) {
		return <LoadingSkeleton rows={5} />;
	}

	if (invoiceQuery.isError || !invoiceQuery.data) {
		return (
			<div className="flex flex-col items-start gap-3">
				<ErrorBanner message={errorMessage(invoiceQuery.error)} />
				<Button variant="outline" onClick={() => void invoiceQuery.refetch()}>
					Retry
				</Button>
			</div>
		);
	}

	const invoice = invoiceQuery.data;
	const isClosed = invoice.status === "paid" || invoice.status === "cancelled";

	return (
		<div className="flex flex-col gap-6">
			<Link
				href="/platform/dashboard/admin/invoices"
				className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm"
			>
				<ArrowLeft className="rtl:rotate-180 size-4" />
				{t("invoices.back")}
			</Link>
			<PageHeader
				title={`Invoice ${invoice.invoice_number}`}
				description={rangeLabel(invoice.period_from, invoice.period_to)}
				actions={
					<>
						<Button
							variant="outline"
							disabled={isClosed}
							onClick={() => setPaidOpen(true)}
						>
							<CheckCircle2 className="size-4" />
							{t("invoices.mark_paid")}
						</Button>
						<ConfirmDialog
							title={t("invoices.cancel_title")}
							description={t("invoices.cancel_desc")}
							confirmLabel="Cancel invoice"
							destructive
							onConfirm={() => cancelMutation.mutate()}
							trigger={
								<Button variant="destructive" disabled={isClosed}>
									<XCircle className="size-4" />
									{t("common.cancel")}
								</Button>
							}
						/>
						<Button variant="outline" onClick={() => void handleDownloadPdf()}>
							<Download className="size-4" />
							{t("invoices.download_pdf")}
						</Button>
					</>
				}
			/>

			<Card>
				<CardHeader>
					<CardTitle>{t("invoices.summary")}</CardTitle>
					<CardDescription>{t("invoices.summary_desc")}</CardDescription>
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<Meta
						label={t("invoices.status")}
						value={<InvoiceStatusBadge status={invoice.status} />}
					/>
					<Meta
						label={t("invoices.total")}
						value={formatCurrency(invoice.total_amount)}
					/>
					<Meta
						label={t("invoices.due_date")}
						value={formatDate(invoice.due_date)}
					/>
					<Meta
						label={t("invoices.generated_label")}
						value={formatDate(invoice.generated_date)}
					/>
					{invoice.paid_date ? (
						<Meta
							label={t("invoices.paid_on")}
							value={formatDate(invoice.paid_date)}
						/>
					) : null}
					{invoice.payment_method ? (
						<Meta
							label={t("invoices.payment_method")}
							value={invoice.payment_method}
						/>
					) : null}
					{invoice.payment_reference ? (
						<Meta
							label={t("invoices.payment_reference")}
							value={invoice.payment_reference}
						/>
					) : null}
					{invoice.payment_notes ? (
						<Meta
							label={t("invoices.payment_notes")}
							value={invoice.payment_notes}
						/>
					) : null}
				</CardContent>
			</Card>

			<div className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">{t("invoices.line_items")}</h2>
				{invoice.items.length === 0 ? (
					<EmptyState
						icon={FileText}
						title={t("invoices.no_line_items")}
						description={t("invoices.no_line_items_desc")}
					/>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("library.description")}</TableHead>
									<TableHead className="text-end">
										{t("invoices.rate")}
									</TableHead>
									<TableHead className="text-end">
										{t("invoices.qty")}
									</TableHead>
									<TableHead className="text-end">
										{t("invoices.amount")}
									</TableHead>
									<TableHead>{t("invoices.billable")}</TableHead>
									<TableHead>{t("invoices.override_reason")}</TableHead>
									<TableHead className="text-end">
										{t("common.actions")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoice.items.map((item) => (
									<TableRow key={item.id}>
										<TableCell>{item.description}</TableCell>
										<TableCell className="text-end">
											{formatCurrency(item.rate)}
										</TableCell>
										<TableCell className="text-end">{item.quantity}</TableCell>
										<TableCell className="text-end">
											{formatCurrency(item.amount)}
										</TableCell>
										<TableCell>
											<StatusBadge
												variant={item.billable ? "success" : "secondary"}
											>
												{item.billable ? "Billable" : "Not billable"}
											</StatusBadge>
										</TableCell>
										<TableCell>{item.override_reason ?? "-"}</TableCell>
										<TableCell className="text-end">
											<Button
												variant="outline"
												size="sm"
												disabled={isClosed}
												onClick={() => setOverrideItem(item)}
											>
												{t("invoices.override")}
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</div>

			{paidOpen ? (
				<MarkPaidDialog
					invoiceId={invoiceId}
					onClose={() => setPaidOpen(false)}
					onSuccess={invalidate}
				/>
			) : null}

			{overrideItem ? (
				<OverrideDialog
					key={overrideItem.id}
					item={overrideItem}
					onClose={() => setOverrideItem(null)}
					onSuccess={invalidate}
				/>
			) : null}
		</div>
	);
}
