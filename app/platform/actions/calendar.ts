import { getApi } from "@/lib/apiClient"
import { DownloadICSFeedResponseState, EnableFeedResponseState, GenerateFeedResponseState, GetCalendarDayDataResponseState, GetCalendarGridResponseState, RotateFeedResponseState } from "../lib/definitions"
import { handleApiCall } from "./common"

const api = getApi()

export async function calenderGetData({ startDate, endDate }: { startDate: string, endDate: string }): Promise<GetCalendarGridResponseState> {
    if (!startDate || !endDate) {
        throw new Error("Start date and end date are required")
    }
    const res = await handleApiCall(() => api.api.getCalendarGridApiV2CalendarGridGet({ start_date: startDate, end_date: endDate }))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function calenderGetDayData(dayID: string[]): Promise<GetCalendarDayDataResponseState> {
    if (!dayID || dayID.length === 0) {
        throw new Error("Day IDs are required")
    }
    const res = await handleApiCall(() => api.api.listAllApiV1LessonsGet())
    if (!res.data?.items) return { message: 'fail' }
    const filteredData = res.data.items.filter((lesson) => dayID.includes(lesson.id.toString()))
    return { message: 'success', data: filteredData }
}

export async function calenderGenerateFeed(): Promise<GenerateFeedResponseState> {
    const res = await handleApiCall(() => api.api.getFeedApiV2CalendarFeedGet())
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function calenderEnableFeed(isEnabled: boolean): Promise<EnableFeedResponseState> {
    const res = await handleApiCall(() => api.api.updateFeedApiV2CalendarFeedPatch({ is_enabled: isEnabled }))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function calenderRotateFeed(): Promise<RotateFeedResponseState> {
    const res = await handleApiCall(() => api.api.rotateFeedApiV2CalendarFeedRotatePost())
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function calenderFeedICSDownload(feedUrlOrToken: string): Promise<DownloadICSFeedResponseState> {
    try {
        let token = feedUrlOrToken
        if (feedUrlOrToken.includes('/feed/')) {
            const match = feedUrlOrToken.match(/\/feed\/([^\/]+)/)
            if (match) {
                token = match[1].replace('.ics', '')
            }
        }
        
        const response = await api.api.downloadCalendarFeedApiV2CalendarFeedFeedTokenIcsGet(token)
        if (!response.ok) return { message: 'fail' }
        
        let icsContent = response.data
        if (!icsContent && response.body) {
            icsContent = await response.text()
        }
        if (!icsContent || typeof window === 'undefined') return { message: 'fail' }
        
        const icsString = typeof icsContent === 'string' ? icsContent : JSON.stringify(icsContent)
        const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        link.setAttribute('href', url)
        link.setAttribute('download', 'calendar.ics')
        link.style.visibility = 'hidden'
        
        document.body.appendChild(link)
        link.click()
        
        setTimeout(() => {
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }, 100)
        
        return { message: 'success', data: icsString }
    } catch {
        return { message: 'fail' }
    }
}
