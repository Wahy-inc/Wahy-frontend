import * as openApi from "@/lib/openApi";

export type GetCalendarGridResponseState = 
| {
    data?: openApi.CalendarGridResponse;
    message: string;
} | undefined;

export type GetCalendarDayDataResponseState = 
| {
    data?: openApi.LessonRead;
    message: string;
} | undefined;