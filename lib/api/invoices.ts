import { api } from "./client";
import type {
	InvoiceRead,
	InvoiceWithItemsRead,
	InvoiceItemOverrideRequest,
	InvoiceItemRead,
	InvoicePaidRequest,
} from "../data-contracts";
import type { Paginated } from "./parents";

export function listInvoices(options?: {
	parentId?: number;
	page?: number;
	perPage?: number;
}): Promise<Paginated<InvoiceRead>> {
	return api<Paginated<InvoiceRead>>("/api/v1/invoices", {
		query: {
			parent_id: options?.parentId,
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function listMyInvoices(options?: {
	page?: number;
	perPage?: number;
}): Promise<Paginated<InvoiceRead>> {
	return api<Paginated<InvoiceRead>>("/api/v1/invoices/me", {
		query: {
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function getInvoice(invoiceId: number): Promise<InvoiceWithItemsRead> {
	return api<InvoiceWithItemsRead>(`/api/v1/invoices/${invoiceId}`);
}

export function getMyInvoice(invoiceId: number): Promise<InvoiceWithItemsRead> {
	return api<InvoiceWithItemsRead>(`/api/v1/invoices/me/${invoiceId}`);
}

export function overrideInvoiceItem(
	invoiceId: number,
	payload: InvoiceItemOverrideRequest,
): Promise<InvoiceItemRead> {
	return api<InvoiceItemRead>(`/api/v1/invoices/${invoiceId}/overrides`, {
		method: "POST",
		body: payload,
	});
}

export function markInvoicePaid(invoiceId: number, payload: InvoicePaidRequest): Promise<InvoiceRead> {
	return api<InvoiceRead>(`/api/v1/invoices/${invoiceId}/paid`, {
		method: "PATCH",
		body: payload,
	});
}

export function cancelInvoice(invoiceId: number): Promise<InvoiceRead> {
	return api<InvoiceRead>(`/api/v1/invoices/${invoiceId}/cancel`, { method: "PATCH" });
}

export function downloadInvoicePdf(invoiceId: number): Promise<Blob> {
	return api<Blob>(`/api/v1/invoices/${invoiceId}/pdf`, { blob: true });
}

export function downloadMyInvoicePdf(invoiceId: number): Promise<Blob> {
	return api<Blob>(`/api/v1/invoices/me/${invoiceId}/pdf`, { blob: true });
}
