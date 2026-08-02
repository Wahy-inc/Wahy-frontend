"use client";
import { useLocalization } from "@/lib/localization-context";

import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import {
	InvoiceStatusBadge,
	StatusBadge,
} from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { errorMessage } from "@/components/shared/error-text";
import { formatDate, rangeLabel } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import { downloadMyInvoicePdf, getMyInvoice } from "@/lib/api/invoices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { InvoiceItemRead } from "@/lib/data-contracts";

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

export default function ParentInvoiceDetailPage() {
	const { t } = useLocalization();
	const params = useParams<{ invoiceId: string }>();
	const invoiceId = Number(params.invoiceId);

	const {
		data: invoice,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["my-invoices", invoiceId],
		queryFn: () => getMyInvoice(invoiceId),
		enabled: Number.isFinite(invoiceId),
	});

	const downloadMutation = useMutation({
		mutationFn: () => downloadMyInvoicePdf(invoiceId),
		onSuccess: (blob: Blob) => {
			downloadBlob(blob, `${invoice?.invoice_number ?? "invoice"}.pdf`);
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	if (!Number.isFinite(invoiceId)) {
		return <ErrorBanner message={t("error_messages.invalid_invoice_id")} />;
	}
	if (isLoading) {
		return <LoadingSkeleton rows={6} />;
	}
	if (isError) {
		return <ErrorBanner message={errorMessage(error)} />;
	}
	if (!invoice) {
		return <ErrorBanner message={t("invoices.not_found")} />;
	}

	const details: Array<{ label: string; value: string }> = [
		{
			label: t("invoices.period"),
			value: rangeLabel(invoice.period_from, invoice.period_to),
		},
		{
			label: t("invoices.generated_label"),
			value: formatDate(invoice.generated_date),
		},
		{ label: t("invoices.due_date"), value: formatDate(invoice.due_date) },
		{
			label: t("invoices.paid_date"),
			value: formatDate(invoice.paid_date) || t("invoices.not_paid"),
		},
		{
			label: t("invoices.payment_method"),
			value: invoice.payment_method || t("invoices.not_recorded"),
		},
		{
			label: t("invoices.payment_reference"),
			value: invoice.payment_reference || t("invoices.not_recorded"),
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={invoice.invoice_number}
				description={`Invoice total: ${formatCurrency(invoice.total_amount)}`}
				actions={
					<div className="flex flex-wrap items-center gap-2">
						<InvoiceStatusBadge status={invoice.status} />
						<Button
							onClick={() => downloadMutation.mutate()}
							disabled={downloadMutation.isPending}
						>
							<Download className="size-4" />
							{downloadMutation.isPending
								? t("invoices.preparing")
								: t("invoices.download_pdf")}
						</Button>
					</div>
				}
			/>

			<Button variant="outline" className="w-fit" asChild>
				<Link href="/platform/dashboard/parent/invoices">
					<ArrowLeft className="rtl:rotate-180 size-4" />
					Back to invoices
				</Link>
			</Button>

			<Card>
				<CardHeader>
					<CardTitle>{t("invoices.summary")}</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
						{details.map((detail) => (
							<div
								key={detail.label}
								className="flex items-center justify-between gap-4 border-b pb-2"
							>
								<dt className="text-muted-foreground">{detail.label}</dt>
								<dd className="text-end">{detail.value}</dd>
							</div>
						))}
					</dl>
				</CardContent>
			</Card>

			<section className="flex flex-col gap-3">
				<h2 className="text-lg font-semibold">{t("invoices.line_items")}</h2>
				{invoice.items.length === 0 ? (
					<p className="text-muted-foreground text-sm">
						{t("invoices.no_line_items")}
					</p>
				) : (
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("library.description")}</TableHead>
									<TableHead>{t("invoices.rate")}</TableHead>
									<TableHead>{t("invoices.quantity")}</TableHead>
									<TableHead>{t("invoices.amount")}</TableHead>
									<TableHead>{t("invoices.billable")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoice.items.map((item: InvoiceItemRead) => (
									<TableRow key={item.id}>
										<TableCell className="max-w-[320px] whitespace-normal">
											{item.description}
										</TableCell>
										<TableCell>{formatCurrency(item.rate)}</TableCell>
										<TableCell>{item.quantity}</TableCell>
										<TableCell>{formatCurrency(item.amount)}</TableCell>
										<TableCell>
											<StatusBadge
												variant={item.billable ? "success" : "secondary"}
											>
												{item.billable
													? "Billable"
													: t("invoices.not_billable")}
											</StatusBadge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={3}>{t("invoices.total")}</TableCell>
									<TableCell colSpan={2} className="text-end font-semibold">
										{formatCurrency(invoice.total_amount)}
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
				)}
			</section>
		</div>
	);
}
