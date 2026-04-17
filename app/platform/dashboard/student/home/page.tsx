'use client'

import DashboardPage from "../page";
import * as icon from '@deemlol/next-icons'
import React from "react";
import * as openApi from "@/lib/openApi"
import { studentNotificationsGetUpcoming } from "@/app/platform/actions/dashboardv2";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useLocalization } from "@/lib/localization-context";

export default function AdminHomePage() {
    const [time, setTime] = React.useState(new Date())
    const { t, language } = useLocalization();
    const [upcomings, setUpcomings] = React.useState<openApi.UpcomingSessionResponse[] | null>(null)

    const fetchUpcomings = async () => {
        try {
            const data = await studentNotificationsGetUpcoming()
            setUpcomings(data)
        } catch (error) {
            console.error('Error fetching upcoming sessions:', error)
            setUpcomings([])
        }
    }
    
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    React.useEffect(() => {
        fetchUpcomings()
    }, [])

    const titleElement = (
        <div className="flex flex-row justify-between my-3">
            <div id="title">
                <p className='text-4xl text-slate-950 font-bold mb-5'>Home Page</p>
            </div>
            <div id="period" className="flex flex-row items-center">
                <form className="grid grid-cols-3 gap-0">
                </form>
            </div>
        </div>
    )

    const timeWidget = (
        <div className="w-full bg-slate-200 border border-slate-400  rounded-xl p-4 my-4 mx-1">
            <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                    <p className="text-xs text-slate-600 uppercase tracking-wide mb-1">Current Time</p>
                    <div className="flex items-center gap-2">
                        <icon.Clock className="w-5 h-5 text-green-500" />
                        <span className="text-[6rem] font-bold text-slate-800">{time.getHours()}
                        <span className="text-8xl font-bold text-slate-800">:</span>{time.getMinutes().toString().padStart(2, '0')}
                        <span className="text-8xl font-bold text-slate-800">:</span>{time.getSeconds().toString().padStart(2, '0')}</span>
                    </div>
                </div>
            </div>
        </div>
    )

    const upcomingSessionsWidget  = (
        <Carousel className="w-full h-full" orientation="horizontal">
                {upcomings && upcomings.length > 0 ? (
                    <CarouselContent className="h-full">
                    {upcomings.map((session) => (
                        <CarouselItem key={`up-session.${session.schedule_id}-${session.student_id}`}>
                            <div className="w-full bg-linear-to-b from-slate-200 to-slate-500 rounded-xl p-4 my-4 mx-1">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-row justify-between">
                                        <div>
                                        <div className="flex items-center gap-2">
                                            <icon.User className="w-5 h-5 text-slate-800" />
                                            <p className="text-sm text-slate-500">{language == 'en' ? session.student_name_en : session.student_name_ar}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <icon.Calendar className="w-5 h-5 text-slate-800" />
                                            <p className="text-sm text-slate-500">{new Date(session.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-slate-200 uppercase tracking-wide mb-1">Start in</p>
                                        <div className="rounded-xl text-center p-5 bg-slate-800 text-slate-200">
                                            {session.minutes_until_start}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-4">
                                    <div className="flex items-center justify-center gap-8">
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('schedules.start_time')}</p>
                                            <div className="flex items-center gap-2">
                                                <icon.Clock className="w-5 h-5 text-green-500" />
                                                <span className="text-2xl font-bold text-slate-800">{session.start_time}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-12 h-0.5 bg-slate-300" />
                                            <icon.ChevronRight className="w-5 h-5 text-slate-400" />
                                            <div className="w-12 h-0.5 bg-slate-300" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('schedules.end_time')}</p>
                                            <div className="flex items-center gap-2">
                                                <icon.Clock className="w-5 h-5 text-red-500" />
                                                <span className="text-2xl font-bold text-slate-800">{session.end_time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                ) : (
                <CarouselContent className="h-full">
                    <CarouselItem className="rounded-xl p-4">
                        <div className="w-full h-full flex items-center justify-center border border-slate-300 bg-slate-50 rounded-xl p-22 mx-1">
                            <p className="text-xl font-bold text-slate-600">No upcoming sessions</p>
                        </div>
                    </CarouselItem>
                </CarouselContent>
                )}
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )

    return <DashboardPage title={titleElement}>
        <div className="grid grid-cols-2 gap-16 items-center">
            <div className="col-start-1 col-end-2">
                {timeWidget}
            </div>
            <div className="col-start-2 col-end-3">
                {upcomingSessionsWidget}
            </div>
        </div>
            </DashboardPage>
}