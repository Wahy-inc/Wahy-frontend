import * as openApi from "@/lib/openApi"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import * as Icon from '@deemlol/next-icons'
import { Clock, Calendar, Power, RefreshCw } from "lucide-react"
import { JSX } from "react"
import { UpdateLessonFormState } from "@/app/platform/lib/definitions"
import { useLocalization } from "@/lib/localization-context"

export default function LessonElement({lesson, updateAction, updateState, updatePending, setUpdateLessonDialogOpen, updateLessonDialogOpen, fieldInput}: {lesson: openApi.ClassGroupItem, updateAction: (formData: FormData) => void, updateState: UpdateLessonFormState | null | undefined, updatePending: boolean, setUpdateLessonDialogOpen: (open: boolean) => void, updateLessonDialogOpen: boolean, fieldInput: (label: string, name: string, defaultValue: string, type: string) => JSX.Element}) {
    const { t, language } = useLocalization()
    const isRTL = language === 'ar'
    return (
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Day Header Bar */}
            <div className={`bg-purple-900 h-2`} />
            
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Schedule Circle */}
                        <div className={`bg-purple-900 min-w-14 h-14 px-2 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {lesson.schedule_id}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{lesson.day_label}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                    <Icon.User className="w-3 h-3 mr-1" />
                                    {language === 'ar' ? lesson.student_name_ar : lesson.student_name_en}
                                </Badge>
                                <span className="text-slate-400 text-sm">ID: {lesson.student_id}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant={lesson.is_active ? "default" : "destructive"} className="gap-1">
                            <Power className="w-3 h-3" />
                            {lesson.is_active ? t('schedules.active') : t('schedules.inactive')}
                        </Badge>
                        {lesson.rrule_string && (
                            <Badge variant="secondary" className="gap-1">
                                <RefreshCw className="w-3 h-3" />
                                {t('schedules.recurring')}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {/* Time Display */}
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('schedules.start_time')}</p>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold text-slate-800">{lesson.start_time}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-12 h-0.5 bg-slate-300" />
                            <Icon.ChevronRight className="w-5 h-5 text-slate-400" />
                            <div className="w-12 h-0.5 bg-slate-300" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('schedules.end_time')}</p>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-red-500" />
                                <span className="text-2xl font-bold text-slate-800">{lesson.end_time}</span>
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
                            <p className="text-sm font-semibold text-slate-700">{lesson.effective_from}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <div>
                            <p className="text-xs text-orange-600 font-medium">{t('schedules.effective_until_label')}</p>
                            <p className="text-sm font-semibold text-slate-700">
                                {lesson.effective_until || t('schedules.no_end_date')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Next Occurrence and Total Lessons */}
                {(lesson.next_occurrence || lesson.total_lessons > 0) && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {lesson.next_occurrence && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-blue-600 font-medium">{t('schedules.next_occurrence')}</p>
                                    <p className="text-sm font-semibold text-slate-700">{lesson.next_occurrence}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                            <Icon.BookOpen className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="text-xs text-indigo-600 font-medium">{t('schedules.total_lessons')}</p>
                                <p className="text-sm font-semibold text-slate-700">{lesson.total_lessons}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <Separator className="my-4" />
                <div className="flex justify-end gap-3">
                    <AlertDialog open={updateLessonDialogOpen} onOpenChange={setUpdateLessonDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 cursor-pointer bg-slate-400 hover:bg-slate-600">{t('lessons.update_lesson')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={updateAction} className="w-full bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('lessons.update_lesson')}</AlertDialogTitle>
                                    <div className={`flex flex-col gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <input type="hidden" name="schedule-id" value={lesson.schedule_id} />
                                        {/* {fieldInput(t('schedules.effective_from_label'), "effective-from", lesson.effective_from, "date")}
                                        {updateState?.error?.effective_from && <p className="text-red-500 text-sm">{updateState.error.effective_from}</p>}
                                        {fieldInput(t('schedules.effective_until_label'), "effective-until", lesson.effective_until || "", "date")}
                                        {updateState?.error?.effective_until && <p className="text-red-500 text-sm">{updateState.error.effective_until}</p>}
                                        {fieldInput(t('schedules.start_time'), "start-time", lesson.start_time, "time")}
                                        {updateState?.error?.start_time && <p className="text-red-500 text-sm">{updateState.error.start_time}</p>}
                                        {fieldInput(t('schedules.end_time'), "end-time", lesson.end_time, "time")}
                                        {updateState?.error?.end_time && <p className="text-red-500 text-sm">{updateState.error.end_time}</p>}
                                        {updateState?.message == 'fail'? <p className="text-red-500 text-sm">{t('lessons.update_failed')}</p> : null} */}
                                    </div>
                                </AlertDialogHeader>
                                <AlertDialogFooter className={`mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <AlertDialogCancel type="reset" disabled={updatePending}>{t('common.cancel')}</AlertDialogCancel>
                                    <Button type="submit" disabled={updatePending}>{updatePending ? t('common.updating') : t('common.update')}</Button>
                                </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}
