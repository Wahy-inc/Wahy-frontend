import { api } from "./client";
import type { NotificationRead, UpcomingSessionResponse } from "../data-contracts";
import type { Paginated } from "./parents";

export function getUpcomingSessions(): Promise<UpcomingSessionResponse[]> {
	return api<UpcomingSessionResponse[]>("/api/v2/notifications/sessions/upcoming");
}

export function getMyUpcomingSessions(options?: {
	studentId?: number;
}): Promise<UpcomingSessionResponse[]> {
	return api<UpcomingSessionResponse[]>("/api/v2/notifications/sessions/me/upcoming", {
		query: { student_id: options?.studentId },
	});
}

export function listNotifications(options?: {
	isRead?: boolean;
	page?: number;
	perPage?: number;
}): Promise<Paginated<NotificationRead>> {
	return api<Paginated<NotificationRead>>("/api/v2/notifications", {
		query: {
			is_read: options?.isRead,
			page: options?.page ?? 1,
			per_page: options?.perPage ?? 20,
		},
	});
}

export function markNotificationRead(notificationId: number): Promise<NotificationRead> {
	return api<NotificationRead>(`/api/v2/notifications/${notificationId}/read`, {
		method: "PATCH",
	});
}

export function markAllNotificationsRead(): Promise<void> {
	return api<void>("/api/v2/notifications/read-all", { method: "POST" });
}
