import { api } from "./client";
import type {
	ChildCreate,
	ChildRead,
	ParentCreate,
	ParentCreatedRead,
	ParentDetailRead,
	ParentInvoiceGenerateRequest,
	ParentRead,
	ParentUpdate,
	InvoiceWithItemsRead,
} from "../data-contracts";
import type { InviteCodeResponse } from "./auth";

export interface Paginated<T> {
	items: T[];
	total: number;
	page: number;
	per_page: number;
	has_next: boolean;
}

export function listParents(options?: {
	search?: string;
	page?: number;
	perPage?: number;
}): Promise<Paginated<ParentRead>> {
	return api<Paginated<ParentRead>>("/api/v1/parents", {
		query: {
			search: options?.search || undefined,
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function createParent(payload: ParentCreate): Promise<ParentCreatedRead> {
	return api<ParentCreatedRead>("/api/v1/parents", { method: "POST", body: payload });
}

export function getParent(parentId: number): Promise<ParentDetailRead> {
	return api<ParentDetailRead>(`/api/v1/parents/${parentId}`);
}

export function updateParent(parentId: number, payload: ParentUpdate): Promise<ParentDetailRead> {
	return api<ParentDetailRead>(`/api/v1/parents/${parentId}`, {
		method: "PATCH",
		body: payload,
	});
}

export function addChild(parentId: number, payload: ChildCreate): Promise<ChildRead> {
	return api<ChildRead>(`/api/v1/parents/${parentId}/children`, {
		method: "POST",
		body: payload,
	});
}

export function regenerateInvite(parentId: number): Promise<InviteCodeResponse> {
	return api<InviteCodeResponse>(`/api/v1/parents/${parentId}/invite/regenerate`, {
		method: "POST",
	});
}

export function generateInvoice(
	parentId: number,
	payload: ParentInvoiceGenerateRequest,
): Promise<InvoiceWithItemsRead> {
	return api<InvoiceWithItemsRead>(`/api/v1/parents/${parentId}/invoices`, {
		method: "POST",
		body: payload,
	});
}

export function setParentActive(parentId: number, active: boolean): Promise<void> {
	return api<void>(`/api/v1/parents/${parentId}/${active ? "activate" : "deactivate"}`, {
		method: "PATCH",
	});
}

export function getMyProfile(): Promise<ParentDetailRead> {
	return api<ParentDetailRead>("/api/v1/parents/me");
}

export function getMyChildren(): Promise<ChildRead[]> {
	return api<ChildRead[]>("/api/v1/parents/me/children");
}
