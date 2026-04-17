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

export default function LessonElement({lesson, updateAction, updateState, updatePending, setUpdateLessonDialogOpen, updateLessonDialogOpen, fieldInput}: {lesson: openApi.LessonRead, updateAction: (formData: FormData) => void, updateState: UpdateLessonFormState | null | undefined, updatePending: boolean, setUpdateLessonDialogOpen: (open: boolean) => void, updateLessonDialogOpen: boolean, fieldInput: (label: string, name: string, defaultValue: string, type: string) => JSX.Element}) {
    const { t, language } = useLocalization()
    const isRTL = language === 'ar'
    return (
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Day Header Bar */}
            <div className={`bg-purple-900 h-2`} />
            
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Lesson Circle */}
                        <div className={`bg-purple-900 min-w-14 h-14 px-2 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {lesson.id}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{lesson.date}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                    <Icon.User className="w-3 h-3 mr-1" />
                                    {t(`lessons.lesson_type_${lesson.type}`)}
                                </Badge>
                                <span className="text-slate-400 text-sm">Student ID: {lesson.student_id}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant={lesson.attendance === openApi.AttendanceStatus.Present ? "default" : "destructive"} className="gap-1">
                            <Power className="w-3 h-3" />
                            {t(`lessons.attendance_${lesson.attendance}`)}
                        </Badge>
                        {lesson.pass_fail !== null && (
                            <Badge variant={lesson.pass_fail ? "default" : "destructive"} className="gap-1">
                                <RefreshCw className="w-3 h-3" />
                                {lesson.pass_fail ? t('lessons.passed') : t('lessons.failed')}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {/* Lesson Details Grid */}
                <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('lessons.lesson_type')}</p>
                            <p className="text-lg font-semibold text-slate-800">{t(`lessons.lesson_type_${lesson.type}`)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('lessons.attendance')}</p>
                            <p className="text-lg font-semibold text-slate-800">{t(`lessons.attendance_${lesson.attendance}`)}</p>
                        </div>
                    </div>
                </div>

                {/* Notes Section */}
                {(lesson.sheikh_notes || lesson.student_notes || lesson.what_is_heard_from_sheikh || lesson.homework) && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {lesson.sheikh_notes && (
                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <Icon.BookOpen className="w-5 h-5 text-blue-600 mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-blue-600 font-medium">{t('lessons.sheikh_notes')}</p>
                                    <p className="text-sm text-slate-700">{lesson.sheikh_notes}</p>
                                </div>
                            </div>
                        )}
                        {lesson.student_notes && (
                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                <Icon.BookOpen className="w-5 h-5 text-green-600 mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-green-600 font-medium">{t('lessons.student_notes')}</p>
                                    <p className="text-sm text-slate-700">{lesson.student_notes}</p>
                                </div>
                            </div>
                        )}
                        {lesson.what_is_heard_from_sheikh && (
                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                <Icon.BookOpen className="w-5 h-5 text-purple-600 mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-purple-600 font-medium">{t('lessons.what_heard')}</p>
                                    <p className="text-sm text-slate-700">{lesson.what_is_heard_from_sheikh}</p>
                                </div>
                            </div>
                        )}
                        {lesson.homework && (
                            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                                <Icon.BookOpen className="w-5 h-5 text-orange-600 mt-1" />
                                <div className="flex-1">
                                    <p className="text-xs text-orange-600 font-medium">{t('lessons.homework')}</p>
                                    <p className="text-sm text-slate-700">{lesson.homework}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Actions */}
                {/* Absence Reason */}
                {lesson.absence_reason && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-xs text-red-600 font-medium mb-1">{t('lessons.absence_reason')}</p>
                        <p className="text-sm text-slate-700">{lesson.absence_reason}</p>
                    </div>
                )}

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
                                        <input type="hidden" name="lesson-id" value={lesson.id} />
                                        {fieldInput(t('lessons.sheikh_notes'), "sheikh-notes", lesson.sheikh_notes || "", "text")}
                                        {updateState?.error?.sheikh_notes && <p className="text-red-500 text-sm">{updateState.error.sheikh_notes}</p>}
                                        {fieldInput(t('lessons.student_notes'), "student-notes", lesson.student_notes || "", "text")}
                                        {updateState?.error?.student_notes && <p className="text-red-500 text-sm">{updateState.error.student_notes}</p>}
                                        {fieldInput(t('lessons.what_heard'), "what-is-heard-from-sheikh", lesson.what_is_heard_from_sheikh || "", "text")}
                                        {updateState?.error?.what_is_heard_from_sheikh && <p className="text-red-500 text-sm">{updateState.error.what_is_heard_from_sheikh}</p>}
                                        {fieldInput(t('lessons.homework'), "homework", lesson.homework || "", "text")}
                                        {updateState?.error?.homework && <p className="text-red-500 text-sm">{updateState.error.homework}</p>}
                                        {updateState?.message == 'fail'? <p className="text-red-500 text-sm">{t('lessons.update_failed')}</p> : null}
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
