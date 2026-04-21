'use client'
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import DashboardPage from "../page"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { calenderEnableFeed, calenderFeedICSDownload, calenderGenerateFeed, calenderGetData, calenderRotateFeed } from "@/app/platform/actions/dashboardv2"
import { GetCalendarGridResponseState } from "@/app/platform/lib/definitionsv2"
import * as React from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function CalendarPage() {
    const router = useRouter()
    const {isAdmin, isLoading: authLoading } = useAuth()
    const [calenderData, setcalenderData] = useState<GetCalendarGridResponseState | undefined>(undefined)
    const isInitialized = React.useRef(false)
    const [feed, setFeed] = useState<string | null>(null)
    const [feedEnabled, setFeedEnabled] = useState<boolean>(false)
    const [feedRotated, setFeedRotated] = useState<Date>()
    const [feedAccessed, setFeedAccessed] = useState<Date>()

    // Helper function to format date in local timezone
    const formatDateLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const fetchCalenderData = async (dateToFetch: Date) => {
        try {
            const startDate = new Date(dateToFetch.getFullYear(), dateToFetch.getMonth(), 1);
            const endDate = new Date(dateToFetch.getFullYear(), dateToFetch.getMonth() + 1, 0);
            const result = await calenderGetData({
                startDate: formatDateLocal(startDate),
                endDate: formatDateLocal(endDate)
            });
            setcalenderData(result);
        } catch (error) {
            console.error("Error fetching calendar data:", error);
        }
    }

    const fetchFeedData = async () => {
        await calenderGenerateFeed().then(result => {
            if (result?.data?.feed_url) {
                setFeed(result.data.feed_url)
            }
            if (result?.data?.is_enabled) {
                setFeedEnabled(result.data.is_enabled)
            }
            if (result?.data?.last_rotated_at) {
                const rotatedDate = new Date(result.data.last_rotated_at)
                setFeedRotated(rotatedDate)
            }
            if (result?.data?.last_accessed_at) {
                const accessedDate = new Date(result.data.last_accessed_at)
                setFeedAccessed(accessedDate)
            }
            if (result?.message === 'fail') {
                setFeed("Failed to generate feed")
            }
        });
    }

    React.useEffect(() => {
        if (authLoading) return
        
        if (isInitialized.current) return // Skip if already initialized
        isInitialized.current = true
        
        fetchCalenderData(new Date())
        fetchFeedData()
    }, [authLoading])

    const titleElement = (
            <div className="flex flex-col justify-start my-3 w-full">
                <div id="title">
                    <p className='text-4xl text-slate-950 font-bold mb-5'>Calendar</p>
                </div>
                <div id="feed" className="rounded-lg border border-slate-400 bg-slate-200 px-4 py-2">
                    <div className="flex flex-row gap-2 items-center">
                        <p className="text-slate-800 font-bold text-md">Feed info</p>
                        <Button variant="outline" className="w-8 h-4 text-[10px] bg-slate-200 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-slate-200" onClick={() => {
                            navigator.clipboard.writeText(feed || "")
                        }}>
                            Copy
                        </Button>
                    </div>
                    <div className="flex xl:flex-row flex-col justify-between gap-1 items-center">
                        <div className="flex flex-row gap-2 items-center">
                            <div className="px-2 py-1 text-sm text-slate-800 rounded-lg border border-slate-400 bg-slate-100 w-[30vw]">
                                <p className="text-slate-800 text-sm wrap-break-word whitespace-normal">{feed || "No feed available"}</p>
                            </div>
                            { feedEnabled && <div className="rounded-3xl bg-slate-800 text-slate-200 w-8 h-8 flex items-center justify-center"><Check className="w-4" /></div> }
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button variant="secondary" className="bg-slate-300 hover:bg-slate-400" onClick={() => {
                                calenderRotateFeed().then(result => {
                                    if (result?.data?.feed_url) {
                                        setFeed(result.data.feed_url)
                                    }
                                    if (result?.data?.rotated_at) {
                                        const rotatedDate = new Date(result.data.rotated_at)
                                        setFeedRotated(rotatedDate)
                                    }
                                })
                            }}>Regenerate</Button>
                            <Button variant="default" className="bg-slate-800 hover:bg-slate-700" onClick={() => {
                                calenderEnableFeed(!feedEnabled).then(result => {
                                    if (result?.data?.is_enabled !== undefined) {
                                        setFeedEnabled(result.data.is_enabled)
                                    }
                                    })
                                }}>
                                {feedEnabled ? "Disable" : "Enable"}
                            </Button>
                            <Button variant="outline" className="bg-slate-200 border-slate-800 text-slate-800 hover:bg-slate-300" onClick={() => {
                                calenderFeedICSDownload(feed || "")
                            }}>Download ICS</Button>
                        </div>
                    </div>
                </div>
            </div>
    )
    
    const content = (
    <div className={`flex flex-col gap-4 w-full items-center`}>
    <Calendar
        mode="single"
        className={`rounded-lg border text-3xl font-bold w-full`}
        onMonthChange={(dateChanged) => {
            fetchCalenderData(dateChanged)
        }}
        components={
        {DayButton: ({children, modifiers, day, ...props}) => {
            const dayString = formatDateLocal(day.date)
            const daysData = calenderData?.data?.slots.filter(d => d.date === dayString)
            return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props} className="p-1">
                    {children}
                    {!modifiers.outside && calenderData?.data && calenderData?.data.slots.length > 0 && daysData && (
                        daysData?.map((dayData, index) => (
                        <div key={index} className="rounded-sm my-0.5 bg-green-100 border-l-4 border-green-500 p-1 flex flex-col items-center justify-center w-full">
                            <p className="text-xs text-green-700 font-bold wrap-break-words w-full text-center">Class</p>
                            <p className="text-xs text-green-700 font-bold wrap-break-words w-full text-center">{dayData?.start_time.slice(0, 5)} <span className="text-gray-500 text-xs">-&gt;-</span> {dayData?.end_time.slice(0, 5)}</p>
                        </div>
                    )))}
                </CalendarDayButton>
            )
        }}
    } onSelect={(selectedDay) => {
        if (!selectedDay) return
        const dayString = formatDateLocal(selectedDay)
        console.log("Selected Day:", selectedDay);
        console.log("Day String:", dayString);
        const dayData = calenderData?.data?.slots.filter(d => d.lesson_data?.date == dayString)
        console.log("Day Data:", dayData);
        const ids = dayData?.map(d => d.lesson_data?.id).join(",")
        router.push(`/platform/dashboard/admin/calender/calenderDayData?dayIDs=${ids}`);
    }} />
    </div>)
  return <DashboardPage title={titleElement}>
    {content}
  </DashboardPage>
}