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
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Lesson Circle */}
                        <div className={`bg-slate-800 min-w-14 h-14 px-2 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {lesson.id}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{lesson.date}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                    <Icon.User className="w-3 h-3 mr-1" />
                                    {t(`lessons.${lesson.type}`)}
                                </Badge>
                                <span className="text-slate-400 text-sm">Student ID: {lesson.student_id}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant={lesson.attendance === openApi.AttendanceStatus.Present ? "default" : "destructive"} className="gap-1">
                            <Power className="w-3 h-3" />
                            {t(`lessons.${lesson.attendance}`)}
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
        </Card>
    )
}
