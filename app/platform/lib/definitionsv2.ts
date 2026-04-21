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

export type GenerateFeedResponseState =
| {
    data?: openApi.CalendarFeedRead;
    message: string;
} | undefined;

export type EnableFeedResponseState =
| {
    data?: { is_enabled: boolean };
    message: string;
} | undefined;

export type RotateFeedResponseState =
| {
    data?: openApi.CalendarFeedRotateRead;
    message: string;
} | undefined;

export type DownloadICSFeedResponseState =
| {
    data?: string;
    message: string;
} | undefined;