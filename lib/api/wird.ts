import { api } from "./client";
import type {
	WirdAssignmentCreate,
	WirdAssignmentRead,
	WirdAssignmentStatus,
	WirdAssignmentUpdate,
	WirdCompletionSubmit,
	WirdReviewRequest,
} from "../data-contracts";

export function listWirdAssignments(options?: {
	studentId?: number;
	status?: WirdAssignmentStatus | null;
}): Promise<WirdAssignmentRead[]> {
	return api<WirdAssignmentRead[]>("/api/v2/wird", {
		query: {
			student_id: options?.studentId,
			status: options?.status ?? undefined,
		},
	});
}

export function listMyWirdAssignments(options?: {
	studentId?: number;
	status?: WirdAssignmentStatus | null;
}): Promise<WirdAssignmentRead[]> {
	return api<WirdAssignmentRead[]>("/api/v2/wird/me", {
		query: {
			student_id: options?.studentId,
			status: options?.status ?? undefined,
		},
	});
}

export function createWirdAssignment(payload: WirdAssignmentCreate): Promise<WirdAssignmentRead> {
	return api<WirdAssignmentRead>("/api/v2/wird", { method: "POST", body: payload });
}

export function updateWirdAssignment(
	assignmentId: number,
	payload: WirdAssignmentUpdate,
): Promise<WirdAssignmentRead> {
	return api<WirdAssignmentRead>(`/api/v2/wird/${assignmentId}`, {
		method: "PATCH",
		body: payload,
	});
}

export function verifyWirdAssignment(
	assignmentId: number,
	payload: WirdReviewRequest,
): Promise<WirdAssignmentRead> {
	return api<WirdAssignmentRead>(`/api/v2/wird/${assignmentId}/verify`, {
		method: "POST",
		body: payload,
	});
}

export function rejectWirdAssignment(
	assignmentId: number,
	payload: WirdReviewRequest,
): Promise<WirdAssignmentRead> {
	return api<WirdAssignmentRead>(`/api/v2/wird/${assignmentId}/reject`, {
		method: "POST",
		body: payload,
	});
}

export function completeWirdAssignment(
	assignmentId: number,
	payload: WirdCompletionSubmit,
): Promise<WirdAssignmentRead> {
	return api<WirdAssignmentRead>(`/api/v2/wird/me/${assignmentId}/complete`, {
		method: "POST",
		body: payload,
	});
}
