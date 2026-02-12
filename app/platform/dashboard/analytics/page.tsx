'use client'

import { Clock } from "lucide-react"
import * as icon from "@deemlol/next-icons"
import * as openApi from "../../../../lib/openApi"
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import dashboardPage from "../page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React, { useState } from "react";
import { attendanceAnalytics, financialAnalytics, getLocalStudent, operationalAnalytics, performanceAnalytics } from "../../actions/dashboard";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function Home() {
    const { isAdmin, isLoading: authLoading } = useAuth()
    const [attendance, setattendance] = React.useState<openApi.AttendanceAnalytics | null>(null);
    const [performance, setPerformance] = React.useState<openApi.PerformanceAnalytics | null>(null);
    const [financial, setFinancial] = React.useState<openApi.FinancialAnalytics | null>(null);
    const [operational, setOperational] = React.useState<openApi.OperationalAnalytics | null>(null);
    const [attendanceState, attendanceAction, attendancePending] = React.useActionState(attendanceAnalytics, undefined);
    const [performanceState, performanceAction, performancePending] = React.useActionState(performanceAnalytics, undefined);
    const [financialState, financialAction, financialPending] = React.useActionState(financialAnalytics, undefined);
    const [operationalState, operationalAction, operationalPending] = React.useActionState(operationalAnalytics, undefined);

    React.useEffect(() => {
        if (attendanceState?.message === 'success' && attendanceState.data) {
            setattendance(attendanceState.data)
        }
        if (performanceState?.message === 'success' && performanceState.data) {
            setPerformance(performanceState.data)
        }
        if (financialState?.message === 'success' && financialState.data) {
            setFinancial(financialState.data)
        }
        if (operationalState?.message === 'success' && operationalState.data) {
            setOperational(operationalState.data)
        }
    }, [attendanceState, performanceState, financialState, operationalState])

    const timeElement = (analytic: {
        period_start: string;
        period_end: string;
    }) => {
        return (
                <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-xl">
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Start Time</p>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold text-slate-800">{analytic.period_start}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-12 h-0.5 bg-slate-300" />
                            <icon.ChevronRight className="w-5 h-5 text-slate-400" />
                            <div className="w-12 h-0.5 bg-slate-300" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">End Time</p>
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
                    <form action={action}>
                        <p className="inline px-1">Period From</p>
                        <Input className="w-32" type="date" name="period_start" id="period_start"></Input>
                        <p className="inline px-1">To</p>
                        <Input className="w-32 mr-2" type="date" name="period_end" id="period_end"></Input>
                        <Button disabled={pending} id="submit" type="submit" className="bg-slate-800 text-slate-100 duration-300 transition hover:bg-slate-100 hover:text-slate-800 hover:border-slate-800 border-2">Submit</Button>
                    </form>
                </div>
            </div>
        )
    }

    const attendanceAnalyticsElement =  (analytic: openApi.AttendanceAnalytics) => {
        return (
            <div className="w-full my-6">
                {titleElement("Attendance Analytics", attendanceAction, attendancePending)}
                <Card className="mb-2 bg-linear-to-r from-slate-50 to-slate-100">
                    {timeElement({
                        period_start: analytic.period_start,
                        period_end: analytic.period_end
                    })}
                </Card>
                <div className="grid grid-cols-1 xl:grid-cols-5 justify-between gap-2">
                    <Card className="col-start-1 col-end-2 xl:col-start-1 xl:col-end-2 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Total Lessons</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold text-center">{analytic.total_lessons}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-2 xl:col-end-5 p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 grid grid-cols-4 w-full p-0">
                            <p className="text-gray-500 text-xl font-bold text-center col-start-1 col-end-2">Present</p>
                            <p className="text-gray-500 text-xl font-bold text-center col-start-2 col-end-3">Late</p>
                            <p className="text-gray-500 text-xl font-bold text-center col-start-3 col-end-4">Absent</p>
                            <p className="text-gray-500 text-xl font-bold text-center col-start-4 col-end-5">Excused</p>
                        </CardHeader>
                        <CardDescription className="grid grid-cols-4">
                            <p className="text-gray-300 text-4xl font-bold col-start-1 col-end-2 text-center">{analytic.present_count}</p>
                            <p className="text-gray-300 text-4xl font-bold col-start-2 col-end-3 text-center">{analytic.late_count}</p>
                            <p className="text-gray-300 text-4xl font-bold col-start-3 col-end-4 text-center">{analytic.absent_count}</p>
                            <p className="text-gray-300 text-4xl font-bold col-start-4 col-end-5 text-center">{analytic.excused_count}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-5 xl:col-end-6 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Attendance Rate</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold">{analytic.attendance_rate}</p>
                        </CardDescription>
                    </Card>
                </div>
            </div>
        )
    }

    const performanceAnalyticsElement =  (analytic: openApi.PerformanceAnalytics) => {
        return (
            <div className="w-full my-6">
                {titleElement("Performance Analytics", performanceAction, performancePending)}
                <Card className="mb-2 bg-linear-to-r from-slate-50 to-slate-100">
                    {timeElement({
                        period_start: analytic.period_start,
                        period_end: analytic.period_end
                    })}
                </Card>
                <div className="grid grid-cols-1 xl:grid-cols-5 justify-between gap-2">
                    <Card className="col-start-1 col-end-2 xl:col-start-1 xl:col-end-2 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 grid grid-cols-2 w-full p-0">
                            <p className="text-gray-500 text-xl font-bold text-center col-start-1 col-end-2">Attended Count</p>
                            <p className="text-gray-500 text-xl font-bold text-center col-start-2 col-end-3">Passed Count</p>
                        </CardHeader>
                        <CardDescription className="grid grid-cols-2">
                            <p className="text-gray-300 text-4xl font-bold text-center col-start-1 col-end-2">{analytic.attended_count}</p>
                            <p className="text-gray-300 text-4xl font-bold text-center col-start-2 col-end-3">{analytic.passed_count}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-2 xl:col-end-5 p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 grid grid-cols-4 w-full p-0">
                            <p className="text-gray-500 text-xl font-bold text-center col-start-1 col-end-2">Pass Rate</p>
                            <p className="text-gray-500 text-xl font-bold text-center col-start-2 col-end-3">Attendance Rate</p>
                            <p className="text-gray-500 text-xl font-bold text-center col-start-3 col-end-4">Homework Rate</p>
                            <p className="text-gray-500 text-xl font-bold text-center col-start-4 col-end-5">Timeliness Rate</p>
                        </CardHeader>
                        <CardDescription className="grid grid-cols-4">
                            <p className="text-gray-300 text-4xl font-bold col-start-1 col-end-2 text-center">{analytic.pass_rate}</p>
                            <p className="text-gray-300 text-4xl font-bold col-start-2 col-end-3 text-center">{analytic.attendance_rate}</p>
                            <p className="text-gray-300 text-4xl font-bold col-start-3 col-end-4 text-center">{analytic.homework_rate}</p>
                            <p className="text-gray-300 text-4xl font-bold col-start-4 col-end-5 text-center">{analytic.timeliness_rate}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-5 xl:col-end-6 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Determination Score</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold">{analytic.determination_score}</p>
                        </CardDescription>
                    </Card>
                </div>
            </div>
        )
    }

    const financialAnalyticsElement =  (analytic: openApi.FinancialAnalytics) => {
        return (
            <div className="w-full my-6">
                {titleElement("Financial Analytics", financialAction, financialPending)}
                <Card className="mb-2 bg-linear-to-r from-slate-50 to-slate-100">
                    {timeElement({
                        period_start: analytic.period_start,
                        period_end: analytic.period_end
                    })}
                </Card>
                <div className="grid grid-cols-1 xl:grid-cols-5 justify-between gap-2">
                    <Card className="col-start-1 col-end-2 xl:col-start-1 xl:col-end-2 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Total Revenue</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold text-center">{analytic.total_revenue}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-2 xl:col-end-5 p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col justify-center items-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Invoices Count</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col justify-center items-center">
                            <p className="text-gray-300 text-4xl font-bold text-center">{analytic.invoice_count}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-5 xl:col-end-6 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Overdue Count</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold text-center">{analytic.overdue_count}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-1 xl:col-end-6">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Revenue per Student</p>
                        </CardHeader>
                        <div id="accordion-data">
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full px-4 py-2 max-h-100 overflow-y-auto"
                            >
                            <AccordionItem key='accordion-item-1' value="item-1">
                            <AccordionTrigger className="text-gray-300 text-xl font-bold text-start">Show Students Revenue</AccordionTrigger>
                            {analytic.revenue_per_student.map((item) => {
                                return (
                                        <AccordionContent key={item.student_id} className="bg-slate-50 rounded-xl p-2 text-gray-500 text-lg my-1">
                                            Name: {getLocalStudent(item.student_id)?.full_name_english || "Unknown"} <br />
                                            Revenue: {item.total_revenue}
                                        </AccordionContent>
                                )
                            })}
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }

    const operationalAnalyticsElement =  (analytic: openApi.OperationalAnalytics) => {
        return (
            <div className="w-full my-6">
                {titleElement("Operational Analytics", operationalAction, operationalPending)}
                <Card className="mb-2 bg-linear-to-r from-slate-50 to-slate-100">
                    {timeElement({
                        period_start: analytic.period_start,
                        period_end: analytic.period_end
                    })}
                </Card>
                <div className="grid grid-cols-1 xl:grid-cols-5 justify-between gap-2">
                    <Card className="col-start-1 col-end-2 xl:col-start-1 xl:col-end-2 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">New Registerations</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold text-center">{analytic.new_registrations}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-2 xl:col-end-5 p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col justify-center items-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Active Students</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col justify-center items-center">
                            <p className="text-gray-300 text-4xl font-bold text-center">{analytic.active_students}</p>
                        </CardDescription>
                    </Card>
                    <Card className="col-start-1 col-end-2 xl:col-start-5 xl:col-end-6 w-full flex flex-col justify-center p-6 bg-white rounded-xl">
                        <CardHeader className="border-b-2 border-gray-500 flex flex-col items-center justify-center">
                            <p className="text-gray-500 text-xl font-bold text-center">Lessons Recorded</p>
                        </CardHeader>
                        <CardDescription className="flex flex-col items-center justify-center">
                            <p className="text-gray-300 text-4xl font-bold text-center">{analytic.lessons_recorded}</p>
                        </CardDescription>
                    </Card>
                </div>
            </div>
        )
    }

    const title = (
        <p className='text-5xl text-slate-950 font-bold mb-5'>Analytics</p>
    )

    const content =  (
        <div className="flex flex-col items-center">
            {attendance? attendanceAnalyticsElement(attendance) : attendanceAnalyticsElement({
            period_start: "____-__-__",
            period_end: "____-__-__",
            total_lessons: 0,
            present_count: 0,
            late_count: 0,
            absent_count: 0,
            excused_count: 0,
            attendance_rate: 0
        })}
        {performance? performanceAnalyticsElement(performance) : performanceAnalyticsElement({
            period_start: "____-__-__",
            period_end: "____-__-__",
            attended_count: 0,
            passed_count: 0,
            pass_rate: 0,
            attendance_rate: 0,
            homework_rate: 0,
            timeliness_rate: 0,
            determination_score: 0
        })}
        {financial? financialAnalyticsElement(financial) : financialAnalyticsElement({
            period_start: "____-__-__",
            period_end: "____-__-__",
            total_revenue: 0,
            invoice_count: 0,
            overdue_count: 0,
            revenue_per_student: []
        })}
        {operational? operationalAnalyticsElement(operational) : operationalAnalyticsElement({
            period_start: "____-__-__",
            period_end: "____-__-__",
            new_registrations: 0,
            active_students: 0,
            lessons_recorded: 0
        })}
        </div>
)
            

    return dashboardPage({children: content, title: title});
}