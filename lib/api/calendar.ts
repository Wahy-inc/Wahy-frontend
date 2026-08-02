import { api } from "./client";
import type {
	CalendarFeedRead,
	CalendarFeedUpdate,
	CalendarFeedRotateRead,
	CalendarGridResponse,
} from "../data-contracts";

export function getCalendarGrid(options: {
	startDate: string;
	endDate?: string;
}): Promise<CalendarGridResponse> {
	return api<CalendarGridResponse>("/api/v2/calendar/grid", {
		query: {
			start_date: options.startDate,
			end_date: options.endDate,
		},
	});
}

export function getCalendarFeed(): Promise<CalendarFeedRead> {
	return api<CalendarFeedRead>("/api/v2/calendar/feed");
}

export function updateCalendarFeed(payload: CalendarFeedUpdate): Promise<CalendarFeedRead> {
	return api<CalendarFeedRead>("/api/v2/calendar/feed", {
		method: "PATCH",
		body: payload,
	});
}

export function rotateCalendarFeed(): Promise<CalendarFeedRotateRead> {
	return api<CalendarFeedRotateRead>("/api/v2/calendar/feed/rotate", { method: "POST" });
}

/** Fetch the raw ICS text for a feed token (public URL, no cookies needed). */
export function fetchIcsFeed(feedUrl: string): Promise<string> {
	return fetch(feedUrl).then((response) => {
		if (!response.ok) {
			throw new Error(`Failed to download feed (${response.status})`);
		}
		return response.text();
	});
}
