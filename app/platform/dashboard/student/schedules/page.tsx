'use client'

import React from "react";
import * as openApi from "@/lib/openApi"
import { getLocalStudent, getSchedulesForStudent, listSchedulesMe } from "@/app/platform/actions/dashboard";
import dashboardPage from "../../page";
import * as icon from '@deemlol/next-icons'
import TitleElement from "./title_element";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, RefreshCw, Power, User, MessageSquare, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";
import { useLocalization } from "@/lib/localization-context";

export default function Schedules() {
    const [schedules, setSchedules] = React.useState<openApi.ScheduleRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [filteredSchedules, setFilteredSchedules] = React.useState<openApi.ScheduleRead[] | null>(null)
    const [getScheduleState, getScheduleAction, getSchedulePending] = React.useActionState(getSchedulesForStudent, undefined)
    const [getScheduleDialogOpen, setGetScheduleDialogOpen] = React.useState(false)
    const { isLoading: authLoading } = useAuth()
    const { t, language } = useLocalization()

    useToastListener(getScheduleState, {functionName: "Get Schedules for Student", successMessage: t('schedules.get_success'), errorMessage: t('schedules.get_error')})
    
    React.useEffect(() => {
        if (getScheduleState?.message == 'success' && getScheduleState.data) {
            setFilteredSchedules(getScheduleState.data)
        }
    }, [getScheduleState])

    React.useEffect(() => {
        if (authLoading) return

            const cachedSchedules = getCachedData<openApi.ScheduleRead[]>(
                offlineCacheKeys.schedulesListMe,
            )
            if (cachedSchedules && cachedSchedules.length > 0) {
                setSchedules(cachedSchedules)
                setLoading(false)
            }

            const fetchSchedules = async () => {
                try {
                    setLoading(true)
                    const data = await listSchedulesMe()
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

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const getDayColor = (day: number): string => {
        const colors = [
            'bg-purple-700', // Saturday
            'bg-blue-700',   // Sunday
            'bg-green-700',  // Monday
            'bg-yellow-700', // Tuesday
            'bg-orange-700', // Wednesday
            'bg-red-700',    // Thursday
            'bg-pink-700',   // Friday
        ]
        return colors[day] || 'bg-slate-500'
    }

    const getDayName = (day: number): string => {
        const dayKeys = ['schedules.saturday', 'schedules.sunday', 'schedules.monday', 'schedules.tuesday', 'schedules.wednesday', 'schedules.thursday', 'schedules.friday']
        return t(dayKeys[day] || 'schedules.saturday')
    }

    const schedulesElement = (schedule: openApi.ScheduleRead) => (
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Day Header Bar */}
            <div className={`${getDayColor(schedule.day_of_week)} h-2`} />
            
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Day Circle */}
                        <div className={`${getDayColor(schedule.day_of_week)} w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {getDayName(schedule.day_of_week).slice(0, 3)}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{getDayName(schedule.day_of_week)}</h3>
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
            </CardContent>
        </Card>
    )

    const title = (
        <TitleElement
            title={t('schedules.title')}
            getSchedualesForStudentAction={getScheduleAction}
            getSchedualesForStudentState={getScheduleState}
            getSchedualesForStudentPending={getSchedulePending}
            fieldInput={fieldInput}
            getStudentScheduleDialogOpen={getScheduleDialogOpen}
            setgetStudentScheduleDialogOpen={setGetScheduleDialogOpen}
        />
    )

    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">{t('schedules.loading_schedules')}</p>, title: title})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: title})
    if (!schedules || schedules.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">{t('schedules.no_schedules_found')}</p>, title: title})
    const displaySchedules = filteredSchedules || schedules
    const content = (
        <div className='flex flex-col gap-4'>
            {displaySchedules?.map((schedule) => (
                <div key={schedule.id}>
                    {schedulesElement(schedule)}
                </div>
            ))}
        </div>
    )

    return dashboardPage({children: content, title: title})
}