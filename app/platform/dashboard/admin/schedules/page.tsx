'use client'

import React from "react";
import * as openApi from "@/lib/openApi"
import { createSchedule, deleteSchedule, getLocalStudent, getSchedulesForStudent, listSchedules, updateSchedule } from "@/app/platform/actions/dashboard";
import DashboardPage from "../page";
import * as icon from '@deemlol/next-icons'
import TitleElement, { generateRRule, monthDays, weekDaysMap } from "./title_element";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2Icon, Clock, Calendar, RefreshCw, Power, User, MessageSquare, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";
import { useLocalization } from "@/lib/localization-context";
import { RRule } from "rrule";

export default function Schedules() {
    const [schedules, setSchedules] = React.useState<openApi.ScheduleRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [searchStudentId, setSearchStudentId] = React.useState<string>("")
    const [filteredSchedules, setFilteredSchedules] = React.useState<openApi.ScheduleRead[] | null>(null)
    const [createScheduleState, createScheduleAction, createSchedulePending] = React.useActionState(createSchedule, undefined)
    const [updateScheduleState, updateScheduleAction, updateSchedulePending] = React.useActionState(updateSchedule, undefined)
    const [getScheduleState, getScheduleAction, getSchedulePending] = React.useActionState(getSchedulesForStudent, undefined)
    const [createScheduleDialogOpen, setCreateScheduleDialogOpen] = React.useState(false)
    const [getScheduleDialogOpen, setGetScheduleDialogOpen] = React.useState(false)
    const [editingScheduleId, setEditingScheduleId] = React.useState<number | null>(null)
    const {isAdmin, isLoading: authLoading } = useAuth()
    const { t, language } = useLocalization()
    const [isRecurring, setIsRecurring] = React.useState<string>('')
    const [isRecurringPeriod, setIsRecurringPeriod] = React.useState<string>('')
    const [selectedDayOfWeek, setSelectedDayOfWeek] = React.useState<string>('')
    const [selectedDaysOfWeek, setSelectedDaysOfWeek] = React.useState<string[]>([])
    const [selectedDayOfMonth, setSelectedDayOfMonth] = React.useState<string>('')
    const [selectedDaysOfMonth, setSelectedDaysOfMonth] = React.useState<string[]>([])


    useToastListener(createScheduleState, {functionName: "Create Schedule", successMessage: t('schedules.create_success'), errorMessage: t('schedules.create_error')})
    useToastListener(updateScheduleState, {functionName: "Update Schedule", successMessage: t('schedules.update_success'), errorMessage: t('schedules.update_error')})
    useToastListener(getScheduleState, {functionName: "Get Schedules for Student", successMessage: t('schedules.get_success'), errorMessage: t('schedules.get_error')})
    
    React.useEffect(() => {
        if (getScheduleState?.message == 'success' && getScheduleState.data) {
            setFilteredSchedules(getScheduleState.data)
        }
        if (
            createScheduleState?.message == 'success' ||
            createScheduleState?.message == 'queued' ||
            updateScheduleState?.message == 'success' ||
            updateScheduleState?.message == 'queued'
        ) {
            const fetchSchedules = async () => {
                try {
                    setLoading(true)
                    const data = await (listSchedules())
                    console.log('Fetched schedules data:', data);
                    setSchedules(data)
                    console.log(data);
                    setError(null)
                } catch (err) {
                    console.error('Error fetching schedules:', err);
                    setError('Failed to load schedules')
                } finally {
                    setLoading(false)
                }
            }
            fetchSchedules()
        }
    }, [getScheduleState, createScheduleState, updateScheduleState])

    React.useEffect(() => {
        if (authLoading) return

            const cachedSchedules = getCachedData<openApi.ScheduleRead[]>(
                offlineCacheKeys.schedulesListAdmin,
            )
            if (cachedSchedules && cachedSchedules.length > 0) {
                setSchedules(cachedSchedules)
                setLoading(false)
            }

            const fetchSchedules = async () => {
                try {
                    setLoading(true)
                    const data = await listSchedules()
                    console.log('Fetched schedules data:', data);
                    setSchedules(data)
                    console.log(data);
                    setError(null)
                } catch (err) {
                    console.error('Error fetching schedules:', err);
                    setError('Failed to load schedules')
                } finally {
                    setLoading(false)
                }
            }
        fetchSchedules()
    }, [authLoading])

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="text-lg">You do not have permission to view this page.</p>
                </div>
            </div>
        )
    }

    const handleCreateSubmit = (formData: FormData) => {        
        // Generate RRULE if recurring
        if (isRecurring === 'true') {
            const effectiveUntil = formData.get('effective-until') as string | null
            const rrule = generateRRule(isRecurringPeriod, selectedDayOfWeek, selectedDaysOfWeek, selectedDayOfMonth, selectedDaysOfMonth, effectiveUntil)
            if (rrule) {
                formData.append("rrule_string", rrule)
            }
        }
        
        updateScheduleAction(formData)
    }

    const handleSearchStudentId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const studentId = e.target.value.trim()
        setSearchStudentId(studentId)
        
        if (studentId === "") {
            setFilteredSchedules(null)
        } else if (schedules) {
            const filtered = schedules.filter((schedule: openApi.ScheduleRead) => 
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

    const weekElement = (type: string) => weekDaysMap && Object.entries(weekDaysMap).map(([key, value]) => (
        <div key={key} className={`flex text-center items-center justify-center text-sm py-2 px-2 rounded-xl transition duration-300 cursor-pointer border border-slate-800 ${(selectedDayOfWeek === key || selectedDaysOfWeek.includes(key)) ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'}`} onClick={() => {
            if (type === 'weekly') {
                if (selectedDayOfWeek === key) {
                    setSelectedDayOfWeek('')
                } else {
                    setSelectedDayOfWeek(key)
                }
            } else if (type === 'customWeekly') {
                if (selectedDaysOfWeek.includes(key)) {
                    if (selectedDaysOfWeek.length === 1) {
                        setSelectedDaysOfWeek([])
                    } else {
                    setSelectedDaysOfWeek(selectedDaysOfWeek.filter((day: string) => day !== key))
                    }
                } else {
                    setSelectedDaysOfWeek([...selectedDaysOfWeek, key])
                }
            }
        }}>
            {t(`schedules.${value}`)}
        </div>
    ))

    const monthElement = (type:string) => monthDays.map((day) => (
        <div key={day} className={`flex text-center items-center justify-center text-sm h-8 w-8 rounded-xl transition duration-300 cursor-pointer border border-slate-800 ${(selectedDayOfMonth === day.toString() || selectedDaysOfMonth.includes(day.toString())) ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'}`} onClick={() => {
            if (type === 'monthly') {
                if (selectedDayOfMonth === day.toString()) {
                    setSelectedDayOfMonth('')
                } else {
                    setSelectedDayOfMonth(day.toString())
                }
            } else if (type === 'customMonthly') {
                if (selectedDaysOfMonth.includes(day.toString())) {
                    if (selectedDaysOfMonth.length === 1) {
                        setSelectedDaysOfMonth([])
                    } else {
                    setSelectedDaysOfMonth(selectedDaysOfMonth.filter((d: string) => d !== day.toString()))
                    }
                } else {
                    setSelectedDaysOfMonth([...selectedDaysOfMonth, day.toString()])
                }
            }
        }}>
            {day}
        </div>
    ))

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const getDate = (rrule: string | null, short: boolean): string => {
        const dayKeys = ['schedules.saturday', 'schedules.sunday', 'schedules.monday', 'schedules.tuesday', 'schedules.wednesday', 'schedules.thursday', 'schedules.friday']
        const shortDayKeys = ['schedules.sat', 'schedules.sun', 'schedules.mon', 'schedules.tue', 'schedules.wed', 'schedules.thu', 'schedules.fri']
        const days = rrule ? RRule.fromString(rrule).options.byweekday.map((d: number) => (d + 2) % 7).sort() : null
        let date = ''
        if (days) {
            for (let i = 0; i < days.length; i++) {
                const weekday = days[i]
                if (weekday !== undefined) {
                    date = date + t(short ? shortDayKeys[weekday] : dayKeys[weekday]) + (i < days.length - 1 ? ", " : "")
                }
            }
        }
        return date
    }

    const schedulesElement = (schedule: openApi.ScheduleRead) => (
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Day Header Bar */}
            <div className={`bg-blue-900 h-2`} />
            
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Day Circle */}
                        <div className={`bg-blue-900 min-w-14 h-14 px-2 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {getDate(schedule.rrule_string, true)}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{getDate(schedule.rrule_string, false)}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                    <User className="w-3 h-3 mr-1" />
                                    {getLocalStudent(schedule.student_id)?.[language === 'ar' ? 'full_name_arabic' : 'full_name_english'] || `Student #${schedule.student_id}`}
                                </Badge>
                                <span className="text-slate-400 text-sm">ID: {schedule.id}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant={schedule.is_active ? "default" : "destructive"} className="gap-1">
                            <Power className="w-3 h-3" />
                            {schedule.is_active ? t('schedules.active') : t('schedules.inactive')}
                        </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <RefreshCw className="w-3 h-3" />
                                {t('schedules.recurring')}
                            </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {/* Time Display */}
                <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('schedules.start_time')}</p>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold text-slate-800">{schedule.start_time}</span>
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
                                <Clock className="w-5 h-5 text-red-500" />
                                <span className="text-2xl font-bold text-slate-800">{schedule.end_time}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Effective Dates */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-xs text-green-600 font-medium">{t('schedules.effective_from_label')}</p>
                            <p className="text-sm font-semibold text-slate-700">{schedule.effective_from}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <div>
                            <p className="text-xs text-orange-600 font-medium">{t('schedules.effective_until_label')}</p>
                            <p className="text-sm font-semibold text-slate-700">
                                {schedule.effective_until || t('schedules.no_end_date')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                {schedule.notes && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                        <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-xs text-blue-600 font-medium mb-1">{t('schedules.notes_label')}</p>
                            <p className="text-sm text-slate-700">{schedule.notes}</p>
                        </div>
                    </div>
                )}

                {/* Cancellation Reason */}
                {schedule.cancellation_reason && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                            <p className="text-xs text-red-600 font-medium mb-1">{t('schedules.cancellation_reason')}</p>
                            <p className="text-sm text-red-700">{schedule.cancellation_reason}</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                        <Separator className="my-4" />
                        <div className="flex justify-end gap-3">
                    <AlertDialog open={editingScheduleId === schedule.id} onOpenChange={(open: boolean) => setEditingScheduleId(open ? schedule.id : null)}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 cursor-pointer bg-slate-400 hover:bg-slate-600">{t('schedules.update_schedule')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleCreateSubmit}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('schedules.update_schedule')}</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                    <input type="hidden" name="schedule-id" value={schedule.id} />
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput(t('schedules.start_time'), "start-time", schedule.start_time, "time")}
                                            {updateScheduleState?.error?.start_time && <p className="text-red-500 text-sm">{updateScheduleState.error.start_time}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('schedules.end_time'), "end-time", schedule.end_time, "time")}
                                            {updateScheduleState?.error?.end_time && <p className="text-red-500 text-sm">{updateScheduleState.error.end_time}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput(t('schedules.effective_from'),"effective-from", schedule.effective_from, "date")}
                                            {updateScheduleState?.error?.effective_from && <p className="text-red-500 text-sm">{updateScheduleState.error.effective_from}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('schedules.effective_until'), "effective-until", schedule.effective_until?? t('schedules.no_end_date'), "date")}
                                            {updateScheduleState?.error?.effective_until && <p className="text-red-500 text-sm">{updateScheduleState.error.effective_until}</p>}
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className="flex flex-col col-start-1 col-end-2">
                                            <label htmlFor="is-recurring" className="text-sm font-medium">{t('schedules.recurring')}</label>
                                            <Select name="is-recurring" onValueChange={(value: string) => {
                                                setIsRecurring(value)
                                            }}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={t('schedules.recurring')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('schedules.recurring')}</SelectLabel>
                                                        <SelectItem value='true'>{t('common.yes')}</SelectItem>
                                                        <SelectItem value='false'>{t('common.no')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {isRecurring === 'true' && (<div className='flex flex-col col-start-2 col-end-3'>
                                            <div className="flex flex-col">
                                                <label htmlFor="is-recurring-period" className="text-sm font-medium">Period</label>
                                                <Select name="is-recurring-period" onValueChange={(value: string) => {
                                                    setIsRecurringPeriod(value)
                                                    setSelectedDayOfWeek('')
                                                    setSelectedDaysOfWeek([])
                                                    setSelectedDayOfMonth('')
                                                    setSelectedDaysOfMonth([])
                                                }}>
                                                    <SelectTrigger className="w-full max-w-48">
                                                        <SelectValue id="selected-recurr-value" placeholder={t('schedules.recurring')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Period</SelectLabel>
                                                            <SelectItem value='daily'>Daily</SelectItem>
                                                            <SelectItem value='weekly'>Weekly</SelectItem>
                                                            <SelectItem value='monthly'>Monthly</SelectItem>
                                                            <SelectItem value='customWeekly'>Custom Weekly</SelectItem>
                                                            <SelectItem value='customMonthly'>Custom Monthly</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>)}
                                    </div>
                                    <div className="col-start-1 col-end-4 row-start-5 row-end-6 flex-wrap flex flex-row gap-1 rounded-xl justify-start">
                                        {isRecurring === 'true' && (isRecurringPeriod === 'weekly' || isRecurringPeriod === 'customWeekly') && (
                                                weekElement(isRecurringPeriod)
                                            )}
                                        {isRecurring === 'true' && (isRecurringPeriod === 'monthly' || isRecurringPeriod === 'customMonthly') && (
                                                monthElement(isRecurringPeriod)
                                            )}
                                    </div>
                                        <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="is-active" className="text-sm font-medium">{t('schedules.active')}</label>
                                            <Select name="is-active" defaultValue={schedule.is_active.toString() === 'true' ? 'true' : 'false'}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={t('schedules.active')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('schedules.active')}</SelectLabel>
                                                        <SelectItem value='true'>{t('common.yes')}</SelectItem>
                                                        <SelectItem value='false'>{t('common.no')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateScheduleState?.error?.is_active && <p className="text-red-500 text-sm">{updateScheduleState.error.is_active}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('schedules.cancellation_reason'), "cancellation-reason", schedule.cancellation_reason ?? t('schedules.enter_notes'), "text")}
                                        {updateScheduleState?.error?.cancellation_reason && <p className="text-red-500 text-sm">{updateScheduleState.error.cancellation_reason}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('schedules.notes'), "notes", schedule.notes ?? t('schedules.enter_notes'), "text")}
                                        {updateScheduleState?.error?.notes && <p className="text-red-500 text-sm">{updateScheduleState.error.notes}</p>}
                                    </div>
                                    {updateScheduleState?.message == 'fail'? <p className="text-red-500 text-sm">{t('schedules.update_failed')}</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={updateSchedulePending}>{t('common.cancel')}</AlertDialogCancel>
                                <Button type="submit" disabled={updateSchedulePending}>{updateSchedulePending ? t('common.updating') : t('common.update')}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    {!(schedule.cancellation_reason || schedule.is_active === false) ? (
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">{t('schedules.delete_schedule')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent size="sm">
                            <AlertDialogHeader>
                            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                <Trash2Icon />
                            </AlertDialogMedia>
                            <AlertDialogTitle>{t('schedules.delete_schedule')}?</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('schedules.delete_desc')}
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel variant="outline">{t('common.cancel')}</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => deleteSchedule(schedule.id)}>{t('common.delete')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                        ) : <div></div> }
                        </div>
            </CardContent>
        </Card>
    )

    const title = (
        <TitleElement
            title={t('schedules.title')}
            handleSearchStudentId={handleSearchStudentId}
            searchStudentId={searchStudentId}
            handleClearFilter={handleClearFilter}
            createAction={createScheduleAction}
            createState={createScheduleState}
            createPending={createSchedulePending}
            getSchedualesForStudentAction={getScheduleAction}
            getSchedualesForStudentState={getScheduleState}
            getSchedualesForStudentPending={getSchedulePending}
            fieldInput={fieldInput}
            createScheduleDialogOpen={createScheduleDialogOpen}
            setcreateScheduleDialogOpen={setCreateScheduleDialogOpen}
            getStudentScheduleDialogOpen={getScheduleDialogOpen}
            setgetStudentScheduleDialogOpen={setGetScheduleDialogOpen}
        />
    )

    if (loading) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('schedules.loading_schedules')}</p></DashboardPage>
    if (error) return <DashboardPage title={title}><p className="text-red-500 text-xl">{error}</p></DashboardPage>
    if (!schedules || schedules.length === 0) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('schedules.no_schedules_found')}</p></DashboardPage>
    const displaySchedules = filteredSchedules || schedules
    const content = (
        <div className='flex flex-col gap-4'>
            {(createScheduleState?.message || updateScheduleState?.message) && (
                <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                    createScheduleState?.message === 'queued' || updateScheduleState?.message === 'queued'
                        ? 'border-amber-200 bg-amber-50 text-amber-800'
                        : createScheduleState?.message === 'fail' || updateScheduleState?.message === 'fail'
                            ? 'border-red-200 bg-red-50 text-red-800'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}>
                    {createScheduleState?.message === 'queued' || updateScheduleState?.message === 'queued'
                        ? t('schedules.offline_sync')
                        : createScheduleState?.message === 'fail' || updateScheduleState?.message === 'fail'
                            ? t('schedules.offline_error')
                            : t('messages.success')}
                </div>
            )}
            {displaySchedules?.map((schedule: openApi.ScheduleRead) => (
                <div key={schedule.id}>
                    {schedulesElement(schedule)}
                </div>
            ))}
        </div>
    )

    return <DashboardPage title={title}>{content}</DashboardPage>
}