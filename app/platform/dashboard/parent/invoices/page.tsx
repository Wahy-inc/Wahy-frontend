"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { InvoiceStatusBadge } from "@/components/shared/status-badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { errorMessage } from "@/components/shared/error-text";
import { formatDate, rangeLabel } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import { listMyInvoices } from "@/lib/api/invoices";
import { useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PER_PAGE = 10;

export default function ParentInvoicesPage() {
	const { t } = useLocalization();
	const [page, setPage] = useState(1);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["my-invoices", page],
		queryFn: () => listMyInvoices({ page, perPage: PER_PAGE }),
	});

	const invoices = data?.items ?? [];
	const total = data?.total ?? 0;

	return (
		<div className="flex flex-col gap-6">
			<PageHeader title={t("invoices.title")} description={t("invoices.parent_desc")} />
			{isLoading ? <LoadingSkeleton rows={6} /> : null}
			{isError ? <ErrorBanner message={errorMessage(error)} /> : null}
			{!isLoading && !isError && invoices.length === 0 ? (
				<EmptyState icon={Receipt} title={t("invoices.no_invoices_found")} description={t("invoices.parent_no_invoices")} />
			) : null}
			{!isLoading && !isError && invoices.length > 0 ? (
				<>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("invoices.invoice")}</TableHead>
									<TableHead>{t("invoices.period")}</TableHead>
									<TableHead>{t("invoices.total")}</TableHead>
									<TableHead>{t("invoices.status")}</TableHead>
									<TableHead>{t("invoices.due_date")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((invoice) => (
									<TableRow key={invoice.id}>
										<TableCell>
											<Link
												href={`/platform/dashboard/parent/invoices/${invoice.id}`}
												className="font-medium hover:underline"
											>
												{invoice.invoice_number}
											</Link>
										</TableCell>
										<TableCell>{rangeLabel(invoice.period_from, invoice.period_to)}</TableCell>
										<TableCell>
											{formatCurrency(invoice.total_amount)}
										</TableCell>
										<TableCell>
											<InvoiceStatusBadge status={invoice.status} />
										</TableCell>
										<TableCell>{formatDate(invoice.due_date)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Pagination page={page} perPage={PER_PAGE} total={total} onChange={setPage} />
				</>
			) : null}
		</div>
	);
}
