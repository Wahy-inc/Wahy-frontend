'use client'

import React from "react";
import * as openApi from "../../../lib/openApi"
import { createSchedule, deleteSchedule, getSchedulesForStudent, listSchedules, updateSchedule } from "@/app/actions/dashboard";
import dashboardPage from "../page";
import * as icon from '@deemlol/next-icons'
import { dummySchedules } from "@/lib/dummyData";
import titleElement from "./title_element";
import { UpdateScheduleFormState } from "@/app/lib/definitions";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2Icon } from "lucide-react";

enum weekDays {
    saturday = 0,
    sunday = 1,
    monday = 2,
    tuesday = 3,
    wednesday = 4,
    thursday = 5,
    friday = 6
}

export default function Schedules() {
    const [schedules, setSchedules] = React.useState<openApi.ScheduleRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [searchStudentId, setSearchStudentId] = React.useState<string>("")
    const [filteredSchedules, setFilteredSchedules] = React.useState<openApi.ScheduleRead[] | null>(null)
    const [createScheduleState, createScheduleAction, createSchedulePending] = React.useActionState(createSchedule, undefined)
    const updateScheduleAction = (state: UpdateScheduleFormState, formData: FormData) => updateSchedule(state, formData, Number(formData.get('schedule-id')))
    const [updateScheduleState, updateScheduleActionState, updateSchedulePending] = React.useActionState(updateScheduleAction, undefined)
    const [getScheduleState, getScheduleAction, getSchedulePending] = React.useActionState(getSchedulesForStudent, undefined)
    const [createScheduleDialogOpen, setCreateScheduleDialogOpen] = React.useState(false)
    const [getScheduleDialogOpen, setGetScheduleDialogOpen] = React.useState(false)
    const [updateScheduleDialogOpen, setUpdateScheduleDialogOpen] = React.useState(false)

     React.useEffect(() => {
        if (getScheduleState?.message == 'success' && getScheduleState.data) {
            setFilteredSchedules(getScheduleState.data)
        }
    }, [getScheduleState])

    React.useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true)
                const data = await listSchedules()
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

    const formatDate = (isoDate: string, option:string): string | undefined => {
        if (option === 'full') {
            return new Date(isoDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            })
        } else if (option === 'time') {
            return new Date(isoDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            })
        }
    }

    const handleSearchStudentId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const studentId = e.target.value.trim()
        setSearchStudentId(studentId)
        
        if (studentId === "") {
            setFilteredSchedules(null)
        } else if (schedules) {
            const filtered = schedules.filter(schedule => 
                schedule.student_id.toString().startsWith(studentId)
            )
            setFilteredSchedules(filtered)
        }
    }

    const handleClearFilter = () => {
        setSearchStudentId("")
        setFilteredSchedules(null)
        const searchInput = document.getElementById("student-id-search") as HTMLInputElement
        if (searchInput) {
            searchInput.value = ""
        }
    }

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const schedulesElement = (schedule: openApi.ScheduleRead) => (
        <div className="overflow-hidden border-2 rounded-xl bg-white flex flex-col justify-start p-4 shadow-[0px_4px_30px_rgba(0,0,0,0.1)] opacity-90 backdrop-blur-sm hover:opacity-80 transition duration-300 hover:scale-101">
            <div className='flex flex-row gap-8 justify-start items-center mb-4'>
                <div id="profile-image" className="w-15 h-15 rounded-full bg-slate-800"></div>
                <div className="flex flex-col justify-start">
                    <p id="name" className="text-4xl text-slate-800">{schedule.id}</p>
                    <div className="flex flex-row gap-12">
                        <p id="start" className="text-slate-700 text-sm flex items-center"><icon.Calendar className='inline mr-1 w-4'/> Day: {weekDays[schedule.day_of_week]}</p>
                        <p id="active" className="text-sm col-start-2 col-end-3 flex items-center" style={{color: schedule.is_active? 'green' : '#fb2c36'}}><icon.Power className='inline mr-1 w-4'/> Active: {schedule.is_active? "Yes" : "No"}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <p id="start" className="text-slate-700 text-xl flex items-center"><icon.Clock className='inline mr-2'/> Start at: {formatDate(schedule.start_time, 'time')}</p>
                <p id="end" className="text-slate-700 text-xl flex items-center"><icon.Clock className='inline mr-2'/> End at: {formatDate(schedule.end_time, 'time')}</p>
            </div>
            <div className="grid grid-cols-2 mt-4 mb-2">
                <p id="eff_from" className="text-slate-700 text-xl col-start-1 col-end-2 flex items-center"><icon.AlarmClockCheck className='inline mr-2'/> Effective from: {formatDate(schedule.effective_from, 'full')}</p>
                <p id="eff_until" className="text-slate-700 text-xl col-start-2 col-end-3 flex items-center"><icon.AlarmClockMinus className='inline mr-2'/> Effective until: {schedule.effective_until? formatDate(schedule.effective_until, 'full') : 'No date Specified'}</p>
            </div>
            <div className="grid grid-cols-2 mt-2 mb-2">
                <p id="recurring" className="text-xl col-start-1 col-end-2 flex items-center"><icon.RefreshCcw className='inline mr-2'/> Recurring: {schedule.is_recurring? "Yes" : "No"}</p>
            </div>
            <p id="notes" className="w-full text-wrap text-[15px] text-slate-700 mt-2 mb-2 flex items-center"><icon.PenTool className='inline mr-2'/> "{schedule.notes}"</p>
            {schedule.cancellation_reason && (<p id="cancel" className="w-full text-wrap text-[15px] text-red-500 mt-2 mb-2 flex items-center"><icon.AlertOctagon className='inline mr-2'/> {schedule.cancellation_reason}</p>)}
            <div className="flex flex-row justify-end items-end gap-4">
                    <AlertDialog open={updateScheduleDialogOpen} onOpenChange={updateScheduleState?.message == 'success'? () => setUpdateScheduleDialogOpen(false) : setUpdateScheduleDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 mt-4 cursor-pointer bg-slate-400 hover:bg-slate-600">Update Schedule</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={updateScheduleActionState}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Update Schedule</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                    <input type="hidden" name="schedule_id" value={schedule.id} />
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className='flex flex-col'>
                                            <div className="flex flex-col">
                                                <label htmlFor="day_of_week" className="text-sm font-medium">Day of Week</label>
                                                <Select name="day_of_week">
                                                    <SelectTrigger className="w-full max-w-48">
                                                        <SelectValue placeholder="Day of Week" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Day of Week</SelectLabel>
                                                            <SelectItem value={String(weekDays.saturday)}>Saturday</SelectItem>
                                                            <SelectItem value={String(weekDays.sunday)}>Sunday</SelectItem>
                                                            <SelectItem value={String(weekDays.monday)}>Monday</SelectItem>
                                                            <SelectItem value={String(weekDays.tuesday)}>Tuesday</SelectItem>
                                                            <SelectItem value={String(weekDays.wednesday)}>Wednesday</SelectItem>
                                                            <SelectItem value={String(weekDays.thursday)}>Thursday</SelectItem>
                                                            <SelectItem value={String(weekDays.friday)}>Friday</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {updateScheduleState?.error?.day_of_week && <p className="text-red-500 text-sm">{updateScheduleState.error.day_of_week}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Start Time", "start-time", "Select start time...", "time")}
                                            {updateScheduleState?.error?.start_time && <p className="text-red-500 text-sm">{updateScheduleState.error.start_time}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("End Time", "end-time", "Select end time...", "time")}
                                            {updateScheduleState?.error?.end_time && <p className="text-red-500 text-sm">{updateScheduleState.error.end_time}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Effective from","effective-from", "date", "date")}
                                            {updateScheduleState?.error?.effective_from && <p className="text-red-500 text-sm">{updateScheduleState.error.effective_from}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Effective until", "effective-until", "date", "date")}
                                            {updateScheduleState?.error?.effective_until && <p className="text-red-500 text-sm">{updateScheduleState.error.effective_until}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="recurring" className="text-sm font-medium">Recurring</label>
                                            <Select name="recurring">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Recurring" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Recurring</SelectLabel>
                                                        <SelectItem value='true'>Yes</SelectItem>
                                                        <SelectItem value='false'>No</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateScheduleState?.error?.is_recurring && <p className="text-red-500 text-sm">{updateScheduleState.error.is_recurring}</p>}
                                    </div>
                                        <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="active" className="text-sm font-medium">Active</label>
                                            <Select name="active">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Active" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Active</SelectLabel>
                                                        <SelectItem value='true'>Yes</SelectItem>
                                                        <SelectItem value='false'>No</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateScheduleState?.error?.is_active && <p className="text-red-500 text-sm">{updateScheduleState.error.is_active}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Cancellation Reason", "cancellation_reason", "Enter cancellation reason...", "text")}
                                        {updateScheduleState?.error?.cancellation_reason && <p className="text-red-500 text-sm">{updateScheduleState.error.cancellation_reason}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Notes", "notes", "Enter notes...", "text")}
                                        {updateScheduleState?.error?.notes && <p className="text-red-500 text-sm">{updateScheduleState.error.notes}</p>}
                                    </div>
                                    {updateScheduleState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to update schedule. Please check the data and try again.</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={updateSchedulePending}>Cancel</AlertDialogCancel>
                                <Button type="submit" disabled={updateSchedulePending}>{updateSchedulePending ? 'Updating...' : 'Update'}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Schedule</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Schedule?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this Schedule data.This operation is not reversible. Are you sure you want to continue?
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={() => deleteSchedule(schedule.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
            </div>
        </div>
    )

    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading schedules...</p>, title: "Schedules"})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: "Schedules"})
    if (!schedules || schedules.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No schedules found.</p>, title: "Schedules"})

    const content = dummySchedules?.map((schedule) => (
        <div key={schedule.id}>
            {schedulesElement(schedule)}
        </div>
    ))

    return dashboardPage({children: content, title: titleElement({
        title: "Schedules",
        handleSearchStudentId: handleSearchStudentId,
        searchStudentId: searchStudentId,
        handleClearFilter: handleClearFilter,
        createAction: createScheduleAction,
        createState: createScheduleState,
        createPending: createSchedulePending,
        getSchedualesForStudentAction: getScheduleAction,
        getSchedualesForStudentState: getScheduleState,
        getSchedualesForStudentPending: getSchedulePending,
        fieldInput: fieldInput,
        createScheduleDialogOpen: createScheduleDialogOpen,
        setcreateScheduleDialogOpen: setCreateScheduleDialogOpen,
        getStudentScheduleDialogOpen: getScheduleDialogOpen,
        setgetStudentScheduleDialogOpen: setGetScheduleDialogOpen,
    }
    )})
}