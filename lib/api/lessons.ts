import { api } from "./client";
import type { LessonCreate, LessonRead, LessonUpdate, RescheduleRequest, RescheduleResponse } from "../data-contracts";
import type { Paginated } from "./parents";

export function listLessons(options?: {
	studentId?: number;
	page?: number;
	perPage?: number;
}): Promise<Paginated<LessonRead>> {
	return api<Paginated<LessonRead>>("/api/v1/lessons", {
		query: {
			student_id: options?.studentId,
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function createLessons(payload: LessonCreate): Promise<LessonRead[]> {
	return api<LessonRead[]>("/api/v1/lessons", { method: "POST", body: payload });
}

export function getLesson(lessonId: number): Promise<LessonRead> {
	return api<LessonRead>(`/api/v1/lessons/${lessonId}`);
}

export function updateLesson(lessonId: number, payload: LessonUpdate): Promise<LessonRead> {
	return api<LessonRead>(`/api/v1/lessons/${lessonId}`, {
		method: "PATCH",
		body: payload,
	});
}

export function rescheduleLesson(
	lessonId: number,
	payload: RescheduleRequest,
): Promise<RescheduleResponse> {
	return api<RescheduleResponse>(`/api/v1/lessons/${lessonId}/reschedule`, {
		method: "PATCH",
		body: payload,
	});
}
