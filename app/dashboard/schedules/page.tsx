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
        <div className="overflow-x-auto border-2 rounded-xl border-slate-800 flex flex-col gap-4 justify-start p-4 m-4">
            <div>
                <div id="profile-image" className="w-10 rounded-full bg-slate-800"></div>
                <p id="name" className="text-4xl text-slate-800">{schedule.id}</p>
            </div>
            <p id="start" className="text-slate-700 text-xl">Start at: {schedule.start_time}</p>
            <p id="end" className="text-slate-700 text-xl">End at: {schedule.end_time}</p>
            <div className="flex flex-row justify-between">
                <p id="recurring" className="text-slate-700 text-xl">Recurring {schedule.is_recurring? "✔" : "✘"}</p>
                <p id="active" className="text-slate-700 text-xl">Active {schedule.is_active? "✔" : "✘"}</p>
            </div>
            <div className="flex flex-row justify-between">
                <p id="eff_from" className="text-slate-700 text-xl">Effective from: {schedule.effective_from}</p>
                <p id="eff_until" className="text-slate-700 text-xl">Effective until: {schedule.effective_until}</p>
            </div>
            <p id="notes" className="w-full text-wrap text-[15px] text-slate-700">{schedule.notes}</p>
            <p id="cancel" className="w-full text-wrap text-[15px] text-red-500">{schedule.cancellation_reason}</p>
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