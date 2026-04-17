import { getApi } from "@/lib/apiClient"
import { GetCalendarDayDataResponseState, GetCalendarGridResponseState } from "../lib/definitionsv2";
import * as openApi from "@/lib/openApi"

const api = getApi()

export async function calenderGetData({startDate, endDate}: {startDate: string, endDate: string}): Promise<GetCalendarGridResponseState> {
    if (!startDate || !endDate) {
        throw new Error("Start date and end date are required");
    }
    try {
        const data = {
            start_date: startDate,
            end_date: endDate
        }
        console.log("Sending data", data);
        const response = await api.api.getCalendarGridApiV2CalendarGridGet(data);
        if (!response.ok || !response.data || response.status == 422) {
            console.log("failed");
            return { message: 'fail' }
        }
        if (response.status == 200) {
            console.log("Received calendar grid data", response.data);
            return { data: response.data, message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        console.error("Error fetching calendar grid data:", error);
        return { message: 'fail' }
    }
}

export async function calenderGetDayData(dayID: string): Promise<GetCalendarDayDataResponseState> {
    if (!dayID) {
        throw new Error("Day ID is required");
    }
    try {
        const response = await api.api.getMyLessonApiV1LessonsMeLessonIdGet(Number(dayID));
        if (!response.ok || !response.data || response.status == 422 || response.status == 404) {
            console.log("failed");
            return { message: 'fail' }
        }
        if (response.status == 200) {
            console.log("Received calendar day data", response.data);
            return { data: response.data, message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        console.error("Error fetching calendar day data:", error);
        return { message: 'fail' }
    }
}

export async function notificationsGetUpcoming(): Promise<openApi.UpcomingSessionResponse[] | null> {
    try {
        const response = await api.api.upcomingSessionsApiV2NotificationsSessionsUpcomingGet();
        if (!response.ok || !response.data) {
            console.log("failed");
            return null
        }
        if (response.status == 200) {
            console.log("Received upcoming notifications", response.data);
            return response.data
        }
        return null
    } catch (error) {
        console.error("Error fetching upcoming notifications:", error);
        return null
    }
}

export async function studentNotificationsGetUpcoming(): Promise<openApi.UpcomingSessionResponse[] | null> {
    try {
        const response = await api.api.myUpcomingSessionsApiV2NotificationsSessionsMeUpcomingGet();
        if (!response.ok || !response.data) {
            console.log("failed");
            return null
        }
        if (response.status == 200) {
            console.log("Received upcoming notifications", response.data);
            return response.data
        }
        return null
    } catch (error) {
        console.error("Error fetching upcoming notifications:", error);
        return null
    }
}

export async function notificationsGetAll(): Promise<openApi.NotificationRead[] | null> {
    try {
        const response = await api.api.listUserNotificationsApiV2NotificationsGet();
        if (!response.ok || !response.data) {
            console.log("failed");
            return null
        }
        if (response.status == 200) {
            console.log("Received notifications", response.data);
            return response.data
        }
        return null
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return null
    }
}

export async function notificationsMarkAsRead(notificationId: number): Promise<boolean> {
    try {
        console.log("Marking notification as read", notificationId);
        const response = await api.api.readNotificationApiV2NotificationsNotificationIdReadPatch(notificationId);
        if (!response.ok) {
            console.log("failed to mark notification as read");
            return false
        }
        if (response.status == 200) {
            console.log("Marked notification as read", notificationId);
            return true
        }
        return false
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return false
    }   
}

export async function notificationsMarkAllAsRead(): Promise<boolean> {
    try {
        console.log("Marking all notifications as read");
        const response = await api.api.readAllNotificationsApiV2NotificationsReadAllPost();
        if (!response.ok) {
            console.log("failed to mark all notifications as read");
            return false
        }
        if (response.status == 204) {
            console.log("Marked all notifications as read");
            return true
        }
        return false
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        return false
    }
}