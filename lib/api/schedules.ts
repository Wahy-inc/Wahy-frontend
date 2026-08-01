import { api } from "./client";
import type { ScheduleCreate, ScheduleRead, ScheduleUpdate } from "../data-contracts";
import type { Paginated } from "./parents";

export function listSchedules(options?: {
	page?: number;
	perPage?: number;
}): Promise<Paginated<ScheduleRead>> {
	return api<Paginated<ScheduleRead>>("/api/v1/schedules", {
		query: {
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function listMySchedules(options?: {
	studentId?: number;
	page?: number;
	perPage?: number;
}): Promise<Paginated<ScheduleRead>> {
	return api<Paginated<ScheduleRead>>("/api/v1/schedules/me", {
		query: {
			student_id: options?.studentId,
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function listSchedulesForStudent(
	studentId: number,
	options?: { page?: number; perPage?: number },
): Promise<Paginated<ScheduleRead>> {
	return api<Paginated<ScheduleRead>>(`/api/v1/schedules/student/${studentId}`, {
		query: {
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function listScheduleLessons(scheduleId: number): Promise<import("../data-contracts").LessonRead[]> {
	return api<import("../data-contracts").LessonRead[]>(`/api/v1/schedules/${scheduleId}/lessons`);
}

export function createSchedule(payload: ScheduleCreate): Promise<ScheduleRead> {
	return api<ScheduleRead>("/api/v1/schedules", { method: "POST", body: payload });
}

export function updateSchedule(
	scheduleId: number,
	payload: ScheduleUpdate,
): Promise<ScheduleRead> {
	return api<ScheduleRead>(`/api/v1/schedules/${scheduleId}`, {
		method: "PATCH",
		body: payload,
	});
}

export function deactivateSchedule(scheduleId: number): Promise<void> {
	return api<void>(`/api/v1/schedules/${scheduleId}`, { method: "DELETE" });
}
