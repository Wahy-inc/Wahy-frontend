'use client'

import { Clock } from "lucide-react"
import * as icon from "@deemlol/next-icons"
import * as openApi from "../../../../../lib/openApi"
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import { attendanceMEAnalytics } from "../../../actions/dashboard";
import { Button } from "@/components/ui/button";
import { useToastListener } from "@/lib/toastListener";
import { useLocalization } from "@/lib/localization-context";
import DashboardPage from "../page";

export default function Home() {
    const [attendance, setattendance] = React.useState<openApi.StudentAttendanceHoursAnalytics | null>(null);
    const [attendanceState, attendanceAction, attendancePending] = React.useActionState(attendanceMEAnalytics, undefined);
    const { t, language } = useLocalization()

    useToastListener(attendanceState, { functionName: t('analytics.attendance_analytics'), successMessage: t('messages.success'), errorMessage: t('messages.error') })

    React.useEffect(() => {
        if (attendanceState?.message === 'success' && attendanceState.data) {
            setattendance(attendanceState.data)
        }
    }, [attendanceState])

    const timeElement = (analytic: {
        period_start: string;
        period_end: string;
    }) => {
        return (
                <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-xl">
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('analytics.start_time')}</p>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold text-slate-800">{analytic.period_start}</span>
                            </div>
                        </div>
                        <div className={`flex items-center ${language === 'ar' ? 'rotate-180' : 'rotate-0'}`}>
                            <div className="w-12 h-0.5 bg-slate-300" />
                            <icon.ChevronRight className="w-5 h-5 text-slate-400" />
                            <div className="w-12 h-0.5 bg-slate-300" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('analytics.end_time')}</p>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-red-500" />
                                <span className="text-2xl font-bold text-slate-800">{analytic.period_end}</span>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }

    const titleElement = (title: string, action: (formData: FormData) => void, pending: boolean) => {
        return (
            <div className="flex flex-row justify-between my-3">
                <div id="title">
                    <p className='text-4xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div id="period" className="flex flex-row items-center">
                    <form action={action} className="grid grid-cols-3 gap-0">
                        <div className="flex flex-row items-center col-start-1 col-end-2">
                            <p className="inline px-1">{t('analytics.period_from')}</p>
                            <Input className="w-32" type="date" name="period_start" id="period_start"></Input>
                        </div>
                        <div className="flex flex-row items-center col-start-2 col-end-3">
                            <p className="inline px-1">{t('analytics.period_to')}</p>
                            <Input className="w-32 mr-2" type="date" name="period_end" id="period_end"></Input>
                        </div>
                        <Button disabled={pending} id="submit" type="submit" className="col-start-3 col-end-4 bg-slate-800 text-slate-100 duration-300 transition hover:bg-slate-100 hover:text-slate-800 hover:border-slate-800 border-2">{t('common.submit')}</Button>
                    </form>
                </div>
            </div>
        )
    }

    const attendanceAnalyticsElement =  (analytic: openApi.StudentAttendanceHoursAnalytics) => {
        return (
            <div className="w-full my-6">
                {titleElement(t('analytics.attendance_student_analytics'), attendanceAction, attendancePending)}
                <Card className="mb-2 bg-linear-to-r from-slate-50 to-slate-100">
                    {timeElement({
                        period_start: analytic.period_start,
                        period_end: analytic.period_end
                    })}
                </Card>
                <div className="grid grid-cols-1 xl:grid-cols-5 justify-between gap-2">
                    <Card className="col-start-1 col-end-2 xl:col-start-1 xl:col-end-2 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">{t('analytics.hours_per_month')}</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold text-center">{analytic.hours_per_month}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-2 xl:col-end-5 p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 grid grid-cols-2 w-full p-0">
                            <p className="text-gray-500 text-xl font-bold text-center col-start-1 col-end-2">{t('analytics.hours_attended')}</p>
                            <p className="text-gray-500 text-xl font-bold text-center col-start-2 col-end-3">{t('analytics.absent_hours')}</p>
                        </CardHeader>
                        <CardDescription className="grid grid-cols-2">
                            <p className="text-gray-300 text-4xl font-bold col-start-1 col-end-2 text-center">{analytic.hours_attended}</p>
                            <p className="text-gray-300 text-4xl font-bold col-start-2 col-end-3 text-center">{analytic.absent_hours}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-5 xl:col-end-6 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">{t('analytics.remaining_hours')}</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold">{analytic.remaining_hours}</p>
                        </CardDescription>
                    </Card>
                </div>
            </div>
    )}

    const title = (
        <p className='text-5xl text-slate-950 font-bold mb-5'>{t('analytics.title')}</p>
    )

    const content =  (
        <div className="flex flex-col items-center">
            {attendance? attendanceAnalyticsElement(attendance) : attendanceAnalyticsElement({
            period_start: "____-__-__",
            period_end: "____-__-__",
            hours_per_month: 0,
            hours_attended: 0,
            absent_hours: 0,
            remaining_hours: 0
        })}
        </div>
)
            

    return <DashboardPage title={title}>{content}</DashboardPage>
}