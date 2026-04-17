'use client'

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import * as openApi from "@/lib/openApi";
import { dummyHistory } from "@/lib/dummydata";
import DashboardPage from "../../page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import * as Icon from '@deemlol/next-icons';
import { useLocalization } from "@/lib/localization-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function LessonDataPage() {
    const searchData = useSearchParams();
    const scheduleID = searchData.get('scheduleID');
    const studentID = searchData.get('studentID');
    const [history, setHistory] = useState<openApi.ClassHistoryResponse>();
    const { t, language } = useLocalization();
    const isRTL = language === 'ar';

    React.useEffect(() => {
        if (scheduleID) {
            // getLessonHistory({ message: 'pending' }, Number(lessonID)).then((res) => {
            //     setHistory(res?.data);
            // });
            const lessonList = dummyHistory.filter((item) => item.schedule_id === Number(scheduleID) && item.student_id === Number(studentID));
            if (lessonList) {
                setHistory({
                    total: 1,
                    lessons: lessonList,
                });
            }
        }
    }, [scheduleID, studentID]);

    const getAttendanceIcon = (attendance: openApi.AttendanceStatus) => {
        switch (attendance) {
            case openApi.AttendanceStatus.Present:
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case openApi.AttendanceStatus.Absent:
                return <XCircle className="w-5 h-5 text-red-600" />;
            case openApi.AttendanceStatus.Late:
                return <AlertCircle className="w-5 h-5 text-orange-600" />;
            case openApi.AttendanceStatus.Excused:
                return <AlertCircle className="w-5 h-5 text-blue-600" />;
            default:
                return null;
        }
    };

    const getAttendanceColor = (attendance: openApi.AttendanceStatus) => {
        switch (attendance) {
            case openApi.AttendanceStatus.Present:
                return "bg-green-50 border-green-100 text-green-700";
            case openApi.AttendanceStatus.Absent:
                return "bg-red-50 border-red-100 text-red-700";
            case openApi.AttendanceStatus.Late:
                return "bg-orange-50 border-orange-100 text-orange-700";
            case openApi.AttendanceStatus.Excused:
                return "bg-blue-50 border-blue-100 text-blue-700";
            default:
                return "bg-slate-50 border-slate-100 text-slate-700";
        }
    };

    const getQualityBadgeVariant = (pass_fail: boolean | null) => {
        if (pass_fail === null) return "outline";
        return pass_fail ? "default" : "destructive";
    };

    const lessonHistoryElement = (lesson: openApi.LessonRead) => (
        <Card key={lesson.id} className={`overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isRTL? 'text-right' : 'text-left'}`}>
            {/* Lesson Type Header Bar */}
            <div className={`${lesson.type === openApi.LessonType.Evaluation ? 'bg-cyan-900' : lesson.type === openApi.LessonType.NewMemorization ? 'bg-indigo-900' : lesson.type === openApi.LessonType.Revision ? 'bg-amber-900' : 'bg-purple-900'} h-2`} />
            
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Lesson ID Circle */}
                        <div className={`${lesson.type === openApi.LessonType.Evaluation ? 'bg-cyan-900' : lesson.type === openApi.LessonType.NewMemorization ? 'bg-indigo-900' : lesson.type === openApi.LessonType.Revision ? 'bg-amber-900' : 'bg-purple-900'} min-w-14 h-14 px-2 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {lesson.id}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800">{lesson.date}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                    <Icon.BookOpen className="w-3 h-3 mr-1" />
                                    {t(`lessons.${lesson.type}`)}
                                </Badge>
                                <span className="text-slate-400 text-sm">Schedule: {lesson.schedule_id || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Attendance & Pass/Fail Badges */}
                    <div className="flex flex-col gap-2 items-end">
                        <Badge variant="outline" className={`gap-1 ${getAttendanceColor(lesson.attendance)}`}>
                            {getAttendanceIcon(lesson.attendance)}
                            {t(`lessons.${lesson.attendance}`)}
                        </Badge>
                        {lesson.pass_fail !== null && (
                            <Badge variant={getQualityBadgeVariant(lesson.pass_fail)} className="gap-1">
                                {lesson.pass_fail ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {lesson.pass_fail ? t('lessons.passed') : t('lessons.failed')}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {/* Absence Reason */}
                {lesson.absence_reason && (
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-red-600 font-medium mb-1">{t('lessons.absence_reason')}</p>
                            <p className="text-sm text-red-700">{lesson.absence_reason}</p>
                        </div>
                    </div>
                )}

                {/* Sheikh Notes */}
                {lesson.sheikh_notes && (
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                        <Icon.MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-blue-600 font-medium mb-1">{t('lessons.sheikh_notes')}</p>
                            <p className="text-sm text-blue-700">{lesson.sheikh_notes}</p>
                        </div>
                    </div>
                )}

                {/* Student Notes */}
                {lesson.student_notes && (
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
                        <Icon.MessageSquare className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-amber-600 font-medium mb-1">{t('lessons.student_notes')}</p>
                            <p className="text-sm text-amber-700">{lesson.student_notes}</p>
                        </div>
                    </div>
                )}

                {/* What Was Heard From Sheikh */}
                {lesson.what_is_heard_from_sheikh && (
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100 mb-4">
                        <Icon.MessageSquare className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-green-600 font-medium mb-1">{t('lessons.what_heard')}</p>
                            <p className="text-sm text-green-700">{lesson.what_is_heard_from_sheikh}</p>
                        </div>
                    </div>
                )}

                {/* Homework */}
                {lesson.homework && (
                    <>
                        <Separator className="my-4" />
                        <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                            <h4 className="text-lg font-semibold text-indigo-900 mb-3">{t('lessons.homework')}</h4>
                            <p className="text-sm text-indigo-700">{lesson.homework}</p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );

    const content = history?.lessons && history.lessons.length > 0 ? (
        <div className='flex flex-col gap-4'>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-700">{t('lessons.total_lessons')}: {history.total}</h2>
            </div>
            <Accordion
                type="single"
                collapsible
                className="w-full rounded-lg border"
                defaultValue="billing"
            >
                {history.lessons.map((his) => (
                    <AccordionItem
                    key={his.id}
                    value={his.id.toString()}
                    className="border-b px-4 last:border-b-0"
                    >
                    <AccordionTrigger>{his.date}</AccordionTrigger>
                    <AccordionContent>{lessonHistoryElement(his)}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    ) : (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-slate-500 text-lg">{t('lessons.no_lessons_found')}</p>
        </div>
    );

    return (
        <DashboardPage title={t('lessons.lesson_history')}>
            {content}
        </DashboardPage>
    )
}