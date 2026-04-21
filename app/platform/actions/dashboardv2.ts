import { getApi } from "@/lib/apiClient"
import { DownloadICSFeedResponseState, EnableFeedResponseState, GenerateFeedResponseState, GetCalendarDayDataResponseState, GetCalendarGridResponseState, RotateFeedResponseState } from "../lib/definitionsv2";
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

export async function calenderGenerateFeed(): Promise<GenerateFeedResponseState> {
    try {
        const response = await api.api.getFeedApiV2CalendarFeedGet();
        if (!response.ok || !response.data) {
            console.log("failed");
            return {message: 'fail' }
        }
        return {message: 'success', data: response.data }
    } catch (error) {
        console.error("Error generating calendar feed:", error);
        return {message: 'fail' }
    }
}

export async function calenderEnableFeed(isEnabled: boolean): Promise<EnableFeedResponseState> {
    try {
        const response = await api.api.updateFeedApiV2CalendarFeedPatch({ is_enabled: isEnabled });
        if (!response.ok || !response.data) {
            console.log("failed");
            return {message: 'fail' }
        }
        return {message: 'success', data: response.data }
    } catch (error) {
        console.error("Error enabling/disabling calendar feed:", error);
        return {message: 'fail' }
    }
}

export async function calenderRotateFeed(): Promise<RotateFeedResponseState> {
    try {
        const response = await api.api.rotateFeedApiV2CalendarFeedRotatePost();
        if (!response.ok || !response.data) {
            console.log("failed");
            return {message: 'fail' }
        }
        return {message: 'success', data: response.data }
    } catch (error) {
        console.error("Error generating calendar feed:", error);
        return {message: 'fail' }
    }
}

export async function calenderFeedICSDownload(feedUrlOrToken: string): Promise<DownloadICSFeedResponseState> {
    try {
        // Extract token from full URL if a full URL is provided
        let token = feedUrlOrToken;
        if (feedUrlOrToken.includes('/feed/')) {
            // Extract token from URL like: https://host/api/v2/calendar/feed/token.ics
            const match = feedUrlOrToken.match(/\/feed\/([^\/]+)/);
            if (match) {
                token = match[1].replace('.ics', '');
            }
        }
        
        console.log("Downloading ICS feed with token:", token);
        const response = await api.api.downloadCalendarFeedApiV2CalendarFeedFeedTokenIcsGet(token);
        console.log("Response:", response);
        console.log("Response data:", response.data);
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            console.log("Response not ok");
            return {message: 'fail' }
        }
        
        // The response body needs to be read manually since it's a text response
        let icsContent = response.data;
        
        if (!icsContent && response.body) {
            console.log("Reading response body...");
            icsContent = await response.text();
            console.log("ICS content from body:", icsContent);
        }
        
        if (!icsContent) {
            console.log("No ICS content found");
            return {message: 'fail' }
        }
        
        // Ensure we're in browser environment
        if (typeof window === 'undefined') {
            console.log("Not in browser environment");
            return {message: 'fail' }
        }
        
        // Convert data to string if needed
        const icsString = typeof icsContent === 'string' ? icsContent : JSON.stringify(icsContent);
        console.log("ICS String:", icsString);
        
        // Create blob and trigger download
        const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'calendar.ics');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        console.log("Triggering download...");
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        return {message: 'success', data: icsString }
    } catch (error) {
        console.error("Error downloading calendar feed ICS:", error);
        return {message: 'fail' }
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