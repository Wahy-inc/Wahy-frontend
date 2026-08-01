"use client";
import { useLocalization } from "@/lib/localization-context";

import { useZodResolver } from "@/app/platform/lib/use-zod-resolver";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Plus, Receipt } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/shared/searchable-select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { errorMessage } from "@/components/shared/error-text";
import { FieldInput } from "@/components/shared/field-input";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { InvoiceStatusBadge } from "@/components/shared/status-badge";
import { listInvoices } from "@/lib/api/invoices";
import { generateInvoice, getParent, listParents } from "@/lib/api/parents";
import { formatCurrency } from "@/lib/format";
import { formatDate, rangeLabel } from "@/lib/dates";
import {
	invoiceGenerateSchema,
	type InvoiceGenerateValues,
} from "@/app/platform/lib/schemas/parent";
import type {
	ChildRead,
	InvoiceWithItemsRead,
	ParentInvoiceGenerateRequest,
} from "@/lib/data-contracts";

const PAGE_SIZE = 20;
const PARENTS_PAGE_SIZE = 100;

function generateErrorText(err: unknown): string {
	const message = errorMessage(err);
	if (/no rate set/i.test(message)) {
		return `${message} Set a base rate on the child, then try again.`;
	}
	return message;
}

function childName(child: ChildRead): string {
	return child.full_name_english || child.full_name_arabic;
}

interface GenerateInvoiceDialogProps {
	onClose: () => void;
	onGenerated: (invoice: InvoiceWithItemsRead) => void;
}

function GenerateInvoiceDialog({
	onClose,
	onGenerated,
}: GenerateInvoiceDialogProps) {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [parentId, setParentId] = useState<number | null>(null);
	const [excludedIds, setExcludedIds] = useState<ReadonlySet<number>>(
		new Set(),
	);
	const [error, setError] = useState<string | null>(null);

	const parentsQuery = useQuery({
		queryKey: ["parents"],
		queryFn: () => listParents({ perPage: PARENTS_PAGE_SIZE }),
	});

	const parentDetailQuery = useQuery({
		queryKey: ["parents", parentId],
		queryFn: () => getParent(parentId as number),
		enabled: parentId !== null,
	});

	const children = parentDetailQuery.data?.children ?? [];
	const selectedIds = children
		.filter((child) => !excludedIds.has(child.id))
		.map((child) => child.id);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<
		z.input<typeof invoiceGenerateSchema>,
		unknown,
		InvoiceGenerateValues
	>({
		resolver: useZodResolver(invoiceGenerateSchema),
		defaultValues: {
			include_absent: false,
			include_late: false,
			include_excused: false,
			due_date: "",
			currency: "USD",
		},
	});

	const generateMutation = useMutation({
		mutationFn: (payload: ParentInvoiceGenerateRequest) =>
			generateInvoice(parentId as number, payload),
		onSuccess: (invoice) => {
			toast.success(t("invoices.generated_title"));
			queryClient.invalidateQueries({ queryKey: ["invoices"] });
			onClose();
			onGenerated(invoice);
		},
		onError: (err) => setError(generateErrorText(err)),
	});

	const handleParentChange = (value: string) => {
		setParentId(Number(value));
		setExcludedIds(new Set());
		setError(null);
	};

	const toggleChild = (id: number, checked: boolean) => {
		setExcludedIds((prev) => {
			const next = new Set(prev);
			if (checked) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const onSubmit = handleSubmit((values) => {
		if (parentId === null) {
			setError(t("invoices.select_parent"));
			return;
		}
		if (selectedIds.length === 0) {
			setError(t("invoices.select_child"));
			return;
		}
		setError(null);
		generateMutation.mutate({
			student_ids: selectedIds,
			include_absent: values.include_absent,
			include_late: values.include_late,
			include_excused: values.include_excused,
			due_date: values.due_date,
			currency: "USD",
		});
	});

	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent className="max-h-[85vh] overflow-y-auto">
				<form onSubmit={onSubmit} className="flex flex-col gap-4">
					<DialogHeader>
						<DialogTitle>{t("invoices.generate_invoice")}</DialogTitle>
						<DialogDescription>{t("invoices.generate_desc")}</DialogDescription>
					</DialogHeader>
					{error ? <ErrorBanner message={error} /> : null}
					{parentsQuery.isError ? (
						<ErrorBanner message={t("invoices.failed_load_parents")} />
					) : null}
					<div className="flex flex-col gap-1.5">
						<Label>
							{t("invoices.parent")}
							<span className="text-destructive ms-0.5">*</span>
						</Label>
						<SearchableSelect
							value={parentId === null ? undefined : String(parentId)}
							onValueChange={handleParentChange}
							options={
								parentsQuery.data?.items.map((parent) => ({
									value: String(parent.id),
									label: parent.full_name,
								})) ?? []
							}
							placeholder={t("invoices.select_parent")}
						/>
					</div>
					{parentId !== null ? (
						<div className="flex flex-col gap-2">
							<Label>{t("invoices.children")}</Label>
							{parentDetailQuery.isLoading ? (
								<p className="text-muted-foreground text-sm">
									{t("invoices.loading_children")}
								</p>
							) : null}
							{parentDetailQuery.isError ? (
								<p className="text-destructive text-sm">
									{t("invoices.failed_load_children")}
								</p>
							) : null}
							{parentDetailQuery.isSuccess && children.length === 0 ? (
								<p className="text-muted-foreground text-sm">
									{t("invoices.parent_no_children")}
								</p>
							) : null}
							{children.length > 0 ? (
								<div className="flex max-h-40 flex-col gap-2 overflow-y-auto rounded-md border p-3">
									{children.map((child) => (
										<label
											key={child.id}
											className="flex cursor-pointer items-center gap-2 text-sm"
										>
											<input
												type="checkbox"
												checked={!excludedIds.has(child.id)}
												onChange={(event) =>
													toggleChild(child.id, event.target.checked)
												}
												className="size-4 accent-primary"
											/>
											{childName(child)}
										</label>
									))}
								</div>
							) : null}
						</div>
					) : null}
					<div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								{...register("include_absent")}
								className="size-4 accent-primary"
							/>
							{t("invoices.include_absent")}
						</label>
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								{...register("include_late")}
								className="size-4 accent-primary"
							/>
							{t("invoices.include_late")}
						</label>
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								{...register("include_excused")}
								className="size-4 accent-primary"
							/>
							{t("invoices.include_excused")}
						</label>
					</div>
					<FieldInput
						label="Due date"
						type="date"
						required
						error={errors.due_date?.message}
						{...register("due_date")}
					/>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={generateMutation.isPending}>
							{generateMutation.isPending
								? "Generating..."
								: "Generate invoice"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface GeneratedInvoiceDialogProps {
	invoice: InvoiceWithItemsRead;
	onClose: () => void;
}

function GeneratedInvoiceDialog({
	invoice,
	onClose,
}: GeneratedInvoiceDialogProps) {
	const { t } = useLocalization();
	return (
		<Dialog
			open
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("invoices.generated_title")}</DialogTitle>
					<DialogDescription>
						Invoice {invoice.invoice_number} for{" "}
						{formatCurrency(invoice.total_amount)} is ready to view.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						{t("common.close")}
					</Button>
					<Button asChild>
						<Link href={`/platform/dashboard/admin/invoices/${invoice.id}`}>
							{t("invoices.view")}
						</Link>
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default function AdminInvoicesPage() {
	const { t } = useLocalization();
	const [page, setPage] = useState(1);
	const [parentFilter, setParentFilter] = useState<string>("all");
	const [generateOpen, setGenerateOpen] = useState(false);
	const [generatedInvoice, setGeneratedInvoice] =
		useState<InvoiceWithItemsRead | null>(null);

	const parentsQuery = useQuery({
		queryKey: ["parents"],
		queryFn: () => listParents({ perPage: PARENTS_PAGE_SIZE }),
	});

	const parentId = parentFilter === "all" ? undefined : Number(parentFilter);

	const invoicesQuery = useQuery({
		queryKey: ["invoices", { page, parentId }],
		queryFn: () => listInvoices({ page, perPage: PAGE_SIZE, parentId }),
	});

	const parentNameById = useMemo(() => {
		const map = new Map<number, string>();
		for (const parent of parentsQuery.data?.items ?? []) {
			map.set(parent.id, parent.full_name);
		}
		return map;
	}, [parentsQuery.data]);

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("invoices.title")}
				description={t("invoices.manage_desc")}
				actions={
					<Button onClick={() => setGenerateOpen(true)}>
						<Plus className="size-4" />
						{t("invoices.generate_invoice")}
					</Button>
				}
			/>

			<div className="w-full sm:w-64">
				<Label>{t("invoices.parent")}</Label>
				<SearchableSelect
					value={parentFilter}
					onValueChange={(value) => {
						setParentFilter(value);
						setPage(1);
					}}
					options={[
						{ value: "all", label: t("invoices.all_parents") },
						...(parentsQuery.data?.items.map((parent) => ({
							value: String(parent.id),
							label: parent.full_name,
						})) ?? []),
					]}
					placeholder={t("invoices.all_parents")}
				/>
			</div>

			{invoicesQuery.isLoading ? <LoadingSkeleton rows={6} /> : null}

			{invoicesQuery.isError ? (
				<div className="flex flex-col items-start gap-3">
					<ErrorBanner message={errorMessage(invoicesQuery.error)} />
					<Button
						variant="outline"
						onClick={() => void invoicesQuery.refetch()}
					>
						Retry
					</Button>
				</div>
			) : null}

			{invoicesQuery.isSuccess && invoicesQuery.data.items.length === 0 ? (
				<EmptyState
					icon={Receipt}
					title={t("invoices.no_invoices_found")}
					description={t("invoices.no_invoices_desc")}
				/>
			) : null}

			{invoicesQuery.isSuccess && invoicesQuery.data.items.length > 0 ? (
				<div className="flex flex-col gap-4">
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>{t("invoices.invoice")}</TableHead>
									<TableHead>{t("invoices.parent")}</TableHead>
									<TableHead>{t("invoices.period")}</TableHead>
									<TableHead className="text-end">
										{t("invoices.total")}
									</TableHead>
									<TableHead>{t("invoices.status")}</TableHead>
									<TableHead>{t("invoices.due_date")}</TableHead>
									<TableHead className="text-end">
										{t("common.actions")}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoicesQuery.data.items.map((invoice) => (
									<TableRow key={invoice.id}>
										<TableCell>
											<Link
												href={`/platform/dashboard/admin/invoices/${invoice.id}`}
												className="font-medium hover:underline"
											>
												{invoice.invoice_number}
											</Link>
										</TableCell>
										<TableCell>
											{parentNameById.get(invoice.parent_id) ??
												`Parent #${invoice.parent_id}`}
										</TableCell>
										<TableCell>
											{rangeLabel(invoice.period_from, invoice.period_to)}
										</TableCell>
										<TableCell className="text-end">
											{formatCurrency(invoice.total_amount)}
										</TableCell>
										<TableCell>
											<InvoiceStatusBadge status={invoice.status} />
										</TableCell>
										<TableCell>{formatDate(invoice.due_date)}</TableCell>
										<TableCell className="text-end">
											<Button variant="outline" size="sm" asChild>
												<Link
													href={`/platform/dashboard/admin/invoices/${invoice.id}`}
												>
													{t("common.view")}
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					<Pagination
						page={page}
						perPage={PAGE_SIZE}
						total={invoicesQuery.data.total}
						onChange={setPage}
					/>
				</div>
			) : null}

			{generateOpen ? (
				<GenerateInvoiceDialog
					onClose={() => setGenerateOpen(false)}
					onGenerated={setGeneratedInvoice}
				/>
			) : null}

			{generatedInvoice ? (
				<GeneratedInvoiceDialog
					invoice={generatedInvoice}
					onClose={() => setGeneratedInvoice(null)}
				/>
			) : null}
		</div>
	);
}
