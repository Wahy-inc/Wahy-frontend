import { api } from "./client";
import type { ClassFileRead } from "../data-contracts";

export function uploadClassFile(scheduleId: number, file: File): Promise<ClassFileRead> {
	const formData = new FormData();
	formData.append("file", file);
	return api<ClassFileRead>(`/api/v2/class-files/${scheduleId}/files`, {
		method: "POST",
		formData,
	});
}

export function listClassFiles(scheduleId: number): Promise<ClassFileRead[]> {
	return api<ClassFileRead[]>(`/api/v2/class-files/${scheduleId}/files`);
}

export function listMyClassFiles(scheduleId: number): Promise<ClassFileRead[]> {
	return api<ClassFileRead[]>(`/api/v2/class-files/me/${scheduleId}/files`);
}

export function deleteClassFile(scheduleId: number, fileId: number): Promise<void> {
	return api<void>(`/api/v2/class-files/${scheduleId}/files/${fileId}`, { method: "DELETE" });
}

export function downloadClassFile(scheduleId: number, fileId: number): Promise<Blob> {
	return api<Blob>(`/api/v2/class-files/${scheduleId}/files/${fileId}`, { blob: true });
}

export function downloadMyClassFile(scheduleId: number, fileId: number): Promise<Blob> {
	return api<Blob>(`/api/v2/class-files/me/${scheduleId}/files/${fileId}`, { blob: true });
}
