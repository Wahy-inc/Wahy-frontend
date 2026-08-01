import { api } from "./client";
import type {
	BodyCreateApiV1LibraryPost,
	LibraryFileRead,
	LibraryItemRead,
} from "../data-contracts";
import type { Paginated } from "./parents";

export function listLibrary(options?: {
	page?: number;
	perPage?: number;
}): Promise<Paginated<LibraryItemRead>> {
	return api<Paginated<LibraryItemRead>>("/api/v1/library", {
		query: {
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function listMyLibrary(options?: {
	page?: number;
	perPage?: number;
}): Promise<Paginated<LibraryItemRead>> {
	return api<Paginated<LibraryItemRead>>("/api/v1/library/me", {
		query: {
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function getLibraryItem(itemId: number): Promise<LibraryItemRead> {
	return api<LibraryItemRead>(`/api/v1/library/${itemId}`);
}

export function getMyLibraryItem(itemId: number): Promise<LibraryItemRead> {
	return api<LibraryItemRead>(`/api/v1/library/me/${itemId}`);
}

export function createLibraryItem(payload: BodyCreateApiV1LibraryPost): Promise<LibraryItemRead> {
	const formData = new FormData();
	formData.append("title", payload.title);
	formData.append("external_url", payload.external_url);
	if (payload.description) formData.append("description", payload.description);
	if (payload.category) formData.append("category", payload.category);
	if (payload.tags) formData.append("tags", JSON.stringify(payload.tags));
	formData.append("access_level", payload.access_level ?? "all_students");
	if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail);
	if (payload.student_ids && payload.student_ids.length > 0) {
		for (const id of payload.student_ids) {
			formData.append("student_ids", String(id));
		}
	}
	return api<LibraryItemRead>("/api/v1/library", { method: "POST", formData });
}

export function deactivateLibraryItem(itemId: number): Promise<void> {
	return api<void>(`/api/v1/library/${itemId}`, { method: "DELETE" });
}

export function uploadLibraryFile(itemId: number, file: File): Promise<LibraryFileRead> {
	const formData = new FormData();
	formData.append("file", file);
	return api<LibraryFileRead>(`/api/v1/library/${itemId}/files`, {
		method: "POST",
		formData,
	});
}

export function listLibraryFiles(itemId: number): Promise<LibraryFileRead[]> {
	return api<LibraryFileRead[]>(`/api/v1/library/${itemId}/files`);
}

export function deleteLibraryFile(itemId: number, fileId: number): Promise<void> {
	return api<void>(`/api/v1/library/${itemId}/files/${fileId}`, { method: "DELETE" });
}

export function downloadLibraryFile(itemId: number, fileId: number): Promise<Blob> {
	return api<Blob>(`/api/v1/library/${itemId}/files/${fileId}`, { blob: true });
}
