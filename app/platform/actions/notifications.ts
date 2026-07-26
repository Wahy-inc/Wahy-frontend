import { getApi } from "@/lib/apiClient"
import * as openApi from "@/lib/openApi"
import { handleApiCall } from "./common"

const api = getApi()

export async function notificationsGetUpcoming(): Promise<openApi.UpcomingSessionResponse[] | null> {
    const res = await handleApiCall(() => api.api.upcomingSessionsApiV2NotificationsSessionsUpcomingGet())
    return res.data ?? null
}

export async function studentNotificationsGetUpcoming(): Promise<openApi.UpcomingSessionResponse[] | null> {
    const res = await handleApiCall(() => api.api.myUpcomingSessionsApiV2NotificationsSessionsMeUpcomingGet())
    return res.data ?? null
}

export async function notificationsGetAll(): Promise<openApi.NotificationRead[] | null> {
    const res = await handleApiCall(() => api.api.listUserNotificationsApiV2NotificationsGet())
    return res.data?.items ?? null
}

export async function notificationsMarkAsRead(notificationId: number): Promise<boolean> {
    const res = await handleApiCall(() => api.api.readNotificationApiV2NotificationsNotificationIdReadPatch(notificationId))
    return res.message === 'success'
}

export async function notificationsMarkAllAsRead(): Promise<boolean> {
    const res = await handleApiCall(() => api.api.readAllNotificationsApiV2NotificationsReadAllPost(), 204)
    return res.message === 'success'
}
