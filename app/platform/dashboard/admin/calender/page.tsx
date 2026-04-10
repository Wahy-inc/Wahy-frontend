'use client'
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import DashboardPage from "../page"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { calenderGetData } from "@/app/platform/actions/dashboardv2"
import { GetCalendarGridResponseState } from "@/app/platform/lib/definitionsv2"
import * as React from "react"
import { useAuth } from "@/lib/auth-context"

export default function CalendarPage() {
    const router = useRouter()
    const {isAdmin, isLoading: authLoading } = useAuth()
    const [calenderData, setcalenderData] = useState<GetCalendarGridResponseState | undefined>(undefined);
    const isInitialized = React.useRef(false)

    const fetchCalenderData = async (dateToFetch: Date) => {
        try {
            const result = await calenderGetData({
                startDate: `${new Date(dateToFetch.getFullYear(), dateToFetch.getMonth(), 2).toISOString().split('T')[0]}`,
                endDate: `${new Date(dateToFetch.getFullYear(), dateToFetch.getMonth() + 1, 0).toISOString().split('T')[0]}`
            });
            setcalenderData(result);
        } catch (error) {
            console.error("Error fetching calendar data:", error);
        }
    }

    React.useEffect(() => {
        if (authLoading) return
        
        if (isInitialized.current) return // Skip if already initialized
        isInitialized.current = true
        
        fetchCalenderData(new Date())
    }, [authLoading])

    const titleElement = (
            <div className="flex flex-row justify-between my-3">
                <div id="title">
                    <p className='text-4xl text-slate-950 font-bold mb-5'>Calendar</p>
                </div>
                <div id="period" className="flex flex-row items-center">
                    <form className="grid grid-cols-3 gap-0">
                    </form>
                </div>
            </div>
    )
    const content = (<Calendar
        mode="single"
        className="rounded-lg border min-w-full min-h-full text-3xl font-bold"
        onMonthChange={(dateChanged) => {
            fetchCalenderData(dateChanged)
        }}
        components={
        {DayButton: ({children, modifiers, day, ...props}) => {
            const dayString = day.date.toISOString().split('T')[0]
            const dayData = calenderData?.data?.slots.find(d => d.date === dayString)
            return (
                <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                    {children}
                    {!modifiers.outside && calenderData?.data && calenderData?.data.slots.length > 0 && (
                        <div className="w-full h-10 rounded-lg bg-green-200 border border-green-500 m-2 p-1 flex flex-col items-center justify-center">
                            <p className="text-xs text-green-700 font-bold">Class for {dayData?.student_name_en}</p>
                            <p className="text-xs text-green-700 font-bold">{dayData?.start_time.slice(0, 6)} <span className="text-gray-500 text-xs">-&gt;</span> {dayData?.end_time}</p>
                        </div>
                    )}
                </CalendarDayButton>
            )
        }}
    } onSelect={(selectedDay) => {
        if (!selectedDay) return
        const dayData = calenderData?.data?.slots.find(d => d.date === selectedDay.toISOString().split('T')[0])
        router.push(`/platform/dashboard/admin/calender?id=${dayData?.lesson_data?.["id"]}`);
    }} />)
  return DashboardPage({children: content, title: titleElement})
}