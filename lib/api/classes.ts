import { api } from "./client";
import type {
	ClassAttendanceSummary,
	ClassGroupListResponse,
	ClassHistoryResponse,
} from "../data-contracts";

export function listClasses(): Promise<ClassGroupListResponse> {
	return api<ClassGroupListResponse>("/api/v2/classes");
}

export function listMyClasses(options?: { studentId?: number }): Promise<ClassGroupListResponse> {
	return api<ClassGroupListResponse>("/api/v2/classes/me", {
		query: { student_id: options?.studentId },
	});
}

export function getClassHistory(
	scheduleId: number,
	options?: { limit?: number; offset?: number },
): Promise<ClassHistoryResponse> {
	return api<ClassHistoryResponse>(`/api/v2/classes/${scheduleId}/history`, {
		query: {
			limit: options?.limit ?? 20,
			offset: options?.offset ?? 0,
		},
	});
}

export function getMyClassHistory(
	scheduleId: number,
	options?: { limit?: number; offset?: number },
): Promise<ClassHistoryResponse> {
	return api<ClassHistoryResponse>(`/api/v2/classes/me/${scheduleId}/history`, {
		query: {
			limit: options?.limit ?? 20,
			offset: options?.offset ?? 0,
		},
	});
}

export function getClassAttendance(
	scheduleId: number,
	options?: { startDate?: string; endDate?: string },
): Promise<ClassAttendanceSummary> {
	return api<ClassAttendanceSummary>(`/api/v2/classes/${scheduleId}/attendance`, {
		query: {
			start_date: options?.startDate,
			end_date: options?.endDate,
		},
	});
}

export function getMyClassAttendance(
	scheduleId: number,
	options?: { startDate?: string; endDate?: string },
): Promise<ClassAttendanceSummary> {
	return api<ClassAttendanceSummary>(`/api/v2/classes/me/${scheduleId}/attendance`, {
		query: {
			start_date: options?.startDate,
			end_date: options?.endDate,
		},
	});
}
