'use client'

import * as icon from '@deemlol/next-icons'
import { useRouter } from 'next/navigation'
import * as openApi from "../../lib/openApi"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

enum weekDays {
    saturday = 0,
    sunday = 1,
    monday = 2,
    tuesday = 3,
    wednesday = 4,
    thursday = 5,
    friday = 6
}

export default function dashboardPage({children: children, title: title}: {children: React.ReactNode, title: React.ReactNode}  ) {
    const router = useRouter()

    const formatDate = (isoDate: string): string => {
        return new Date(isoDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        })
    }

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

    return (
        <div className="flex flex-row justify-between w-full mt-15 min-h-[90vh]">
            <div id="sidebar" className="sticky top-0 overflow-x-hidden bg-slate-900 text-slate-100 lg:w-sm min-h-screen max-h-screen rounded-r-xl mr-4 shadow-[0px_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                <div className='absolute -left-10 top-10 -z-20 w-40 h-40 rounded-full bg-slate-950 blur-[5px]'></div>
                <div className='absolute -right-10 top-100 -z-20 w-60 h-60 rounded-full bg-slate-700 blur-[5px] opacity-50'></div>
                <div className='absolute left-5 top-150 -z-10 w-60 h-60 rounded-full bg-slate-800 blur-[5px] opacity-50'></div>
                <h2 className="text-2xl font-bold pt-10 p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/dashboard/schedules')}> <icon.Clock className='inline mr-4'/>Schedules</h2>
                <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/dashboard/lessons')}> <icon.Layers className='inline mr-4'/>Lessons</h2>
                <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/dashboard/library')}> <icon.Book className='inline mr-4'/>Library</h2>
                <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/dashboard/students')}> <icon.Users className='inline mr-4'/>My Students</h2>
                <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/dashboard/join-requests')}> <icon.Inbox className='inline mr-4'/>Join Requests</h2>
                <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/dashboard/invoices')}> <icon.DollarSign className='inline mr-4'/>Invoices</h2>
            </div>
            <div id="content" className="m-20 w-full bg-slate-100 min-h-full flex flex-col rounded-xl">
                <div id='title' className='sticky top-0 z-10 bg-slate-100 pt-10 px-10 rounded-xl'>
                    {title}
                </div>
                {/* {dummySchedules.map((schedule) => (
                    <div key={schedule.id}>
                        {schedulesElement(schedule)}
                    </div>
                ))} */}
                <div id='children' className='px-10 flex flex-col gap-8 mb-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}