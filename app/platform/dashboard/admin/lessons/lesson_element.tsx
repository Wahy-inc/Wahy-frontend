import * as openApi from "@/lib/openApi"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import * as Icon from '@deemlol/next-icons'
import { Power, RefreshCw } from "lucide-react"
import { useLocalization } from "@/lib/localization-context"
import { getLocalStudent } from "@/app/platform/actions/dashboard"

export default function LessonElement({lesson}: {lesson: openApi.ClassGroupItem}) {
    const { t, language } = useLocalization()

    return (
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">            
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Lesson Circle */}
                        <div className={`bg-slate-800 min-w-14 h-14 px-2 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {lesson.schedule_id}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{t(`schedules.${lesson.day_label.toLowerCase()}`)}</h3>
                            <h2 className="text-xl font-bold text-slate-600">{lesson.start_time} -&gt;- {lesson.end_time} | next at: {lesson.next_occurrence}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{language === 'ar' ? lesson.student_name_ar : lesson.student_name_en}</Badge>
                                <Badge variant="outline" className="text-xs">
                                    <Icon.User className="w-3 h-3 mr-1" />
                                    {t("lessons.total_lessons")}: {lesson.total_lessons}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Badges */}
                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant={lesson.is_active == true ? "default" : "destructive"} className="gap-1">
                            <Power className="w-3 h-3" />
                            {t(`schedules.${lesson.is_active ? 'active' : 'inactive'}`)}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}
