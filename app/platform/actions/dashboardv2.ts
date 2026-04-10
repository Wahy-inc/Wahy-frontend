import { getApi } from "@/lib/apiClient"
import { GetCalendarDayDataResponseState, GetCalendarGridResponseState } from "../lib/definitionsv2";

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
        const response = await api.api.getCalendarGrid(data);
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