import * as openApi from "@/lib/openApi";
export interface UploadedClassFile {
   "id": number,
   "schedule_id": number,
   "sheikh_id": number,
   "original_filename": string,
   "stored_filename": string,
   "file_path": string,
   "file_size_bytes": number,
   "mime_type": string,
   "download_count": number,
   "created_at": string,
   "updated_at": string
 }

export type GetCalendarGridResponseState = 
| {
    data?: openApi.CalendarGridResponse;
    message: string;
} | undefined;

export type GetCalendarDayDataResponseState = 
| {
    data?: openApi.LessonRead[];
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

export type uploadClassFileResponseState =
| {
    data?: UploadedClassFile;
    message: string;
} | undefined;

export type ListUploadedClassFilesResponseState =
| {
    data?: UploadedClassFile[];
    message: string;
} | undefined;

export type DeleteClassFileResponseState =
| {
    message: string;
} | undefined;

export type DownloadClassFileResponseState =
| {
    data?: Blob;
    message: string;
} | undefined;