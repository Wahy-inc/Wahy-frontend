'use client'

import React from "react";
import * as openApi from "../../../lib/openApi"
import { listScheduals } from "@/app/actions/dashboard";
import dashboardPage from "../page";

export default function Schedules() {
    const [schedules, setSchedules] = React.useState<openApi.ScheduleRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true)
                const data = await listScheduals()
                setSchedules(data)
                setError(null)
            } catch (err) {
                setError('Failed to load schedules')
                setSchedules(null)
            } finally {
                setLoading(false)
            }
        }
        fetchSchedules()
    }, [])

    const schedulesElement = (schedule: openApi.ScheduleRead) => (
        <div className="overflow-hidden border-2 rounded-xl bg-white flex flex-col justify-start p-4 shadow-[0px_4px_30px_rgba(0,0,0,0.1)] opacity-90 backdrop-blur-sm hover:opacity-80 transition duration-300 hover:scale-101">
            <div className='flex flex-row gap-8 justify-start items-center mb-4'>
                <div id="profile-image" className="w-15 h-15 rounded-full bg-slate-800"></div>
                <p id="name" className="text-4xl text-slate-800">{schedule.id}</p>
            </div>
            <p id="start" className="text-slate-700 text-xl flex items-center"><icon.Calendar className='inline mr-2' style={{color: 'rgba(125,125,125,0.8)'}}/> Day: {weekDays[schedule.day_of_week]}</p>
            <p id="start" className="text-slate-700 text-xl flex items-center"><icon.Clock className='inline mr-2' style={{color: 'rgba(242,129,70,0.95)'}}/> Start at: {formatDate(schedule.start_time)}</p>
            <p id="end" className="text-slate-700 text-xl flex items-center"><icon.Clock className='inline mr-2' style={{color: 'rgba(242,129,70,0.95)'}}/> End at: {formatDate(schedule.end_time)}</p>
            <div className="grid grid-cols-2 mt-4 mb-2">
                <p id="eff_from" className="text-slate-700 text-xl col-start-1 col-end-2 flex items-center"><icon.AlarmClockCheck className='inline mr-2' style={{color: 'rgba(70,242,155,0.95)'}}/> Effective from: {formatDate(schedule.effective_from)}</p>
                <p id="eff_until" className="text-slate-700 text-xl col-start-2 col-end-3 flex items-center"><icon.AlarmClockMinus className='inline mr-2' style={{color: 'rgba(244,33,32,0.95)'}}/> Effective until: {schedule.effective_until? formatDate(schedule.effective_until) : 'No date Specified'}</p>
            </div>
            <div className="grid grid-cols-2 mt-2 mb-2">
                <p id="recurring" className="text-xl col-start-1 col-end-2 flex items-center" style={{color: schedule.is_recurring? 'green' : '#fb2c36'}}><icon.RefreshCcw className='inline mr-2'/> Recurring {schedule.is_recurring? "✔" : "✘"}</p>
                <p id="active" className="text-xl col-start-2 col-end-3 flex items-center" style={{color: schedule.is_active? 'green' : '#fb2c36'}}><icon.Power className='inline mr-2'/> Active {schedule.is_active? "✔" : "✘"}</p>
            </div>
            <p id="notes" className="w-full text-wrap text-[15px] text-slate-700 mt-2 mb-2 flex items-center"><icon.PenTool className='inline mr-2' style={{color: 'rgba(245,174,56,0.95)'}}/> "{schedule.notes}"</p>
            {schedule.cancellation_reason && (<p id="cancel" className="w-full text-wrap text-[15px] text-red-500 mt-2 mb-2 flex items-center"><icon.AlertOctagon className='inline mr-2' style={{color: 'rgba(242,129,70,0.95)'}}/> {schedule.cancellation_reason}</p>)}
        </div>
    )

    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading schedules...</p>})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>})
    if (!schedules || schedules.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No schedules found.</p>})

    const content = schedules?.map((schedule) => (
        <div key={schedule.id}>
            {schedulesElement(schedule)}
        </div>
    ))

    return dashboardPage({children: content})
}