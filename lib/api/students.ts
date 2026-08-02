import { api } from "./client";
import type {
	StudentAttendanceHoursAnalytics,
	StudentRead,
	StudentUpdate,
} from "../data-contracts";
import type { Paginated } from "./parents";

export function listStudents(options?: {
	page?: number;
	perPage?: number;
}): Promise<Paginated<StudentRead>> {
	return api<Paginated<StudentRead>>("/api/v1/students", {
		query: {
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function getStudent(studentId: number): Promise<StudentRead> {
	return api<StudentRead>(`/api/v1/students/${studentId}`);
}

export function updateStudent(
	studentId: number,
	payload: StudentUpdate,
): Promise<StudentRead> {
	return api<StudentRead>(`/api/v1/students/${studentId}`, {
		method: "PATCH",
		body: payload,
	});
}

export function getStudentAttendanceHours(
	studentId: number,
	options?: { startDate?: string; endDate?: string },
): Promise<StudentAttendanceHoursAnalytics> {
	return api<StudentAttendanceHoursAnalytics>(
		`/api/v1/students/${studentId}/attendance-hours`,
		{
			query: {
				start_date: options?.startDate,
				end_date: options?.endDate,
			},
		},
	);
}
