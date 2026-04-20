'use client'

import { useSearchParams } from "next/navigation";
import React, { useActionState, useState } from "react";
import * as openApi from "@/lib/openApi";
import DashboardPage from "../../page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import * as Icon from '@deemlol/next-icons';
import { useLocalization } from "@/lib/localization-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getLessonHistory, updateLesson } from "@/app/platform/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LessonDataPage() {
    const searchData = useSearchParams();
    const scheduleID = searchData.get('scheduleID');
    const studentID = searchData.get('studentID');
    const day = searchData.get('day');
    const [history, setHistory] = useState<openApi.ClassHistoryResponse>();
    const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
    const [updateFormSubmitted, setUpdateFormSubmitted] = useState(false);
    const [updateState, updateAction, updatePending] = useActionState(updateLesson, undefined);
    const { t, language } = useLocalization();
    const isRTL = language === 'ar';

    React.useEffect(() => {
        try {
            getLessonHistory({ message: 'pending' }, Number(scheduleID), Number(studentID), Number(day)).then((res) => {
                setHistory(res?.data);
            });
        } catch (error) {
            console.error("Error fetching lesson history:", error);
        }
    }, [scheduleID, studentID, day]);

    const handleUpdateSubmit = (formData: FormData) => {
        setUpdateFormSubmitted(true);
        updateAction(formData);
    }

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

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
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="bg-linear-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('lessons.what_heard')}</p>
                            <div className="flex items-center gap-2">
                                <Icon.FileText className="w-5 h-5 text-indigo-500" />
                                <span className="text-2xl font-bold text-slate-600">
                                    {lesson.what_is_heard_from_sheikh ? (
                                        <p className="text-sm">{lesson.what_is_heard_from_sheikh}</p>
                                    ) : (
                                        <p className="text-sm italic">{t('lessons.no_what_heard')}</p>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-12 h-0.5 bg-slate-300" />
                            <Icon.Circle className="w-5 h-5 text-slate-400" />
                            <div className="w-12 h-0.5 bg-slate-300" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{t('lessons.homework')}</p>
                            <div className="flex items-center gap-2">
                                <Icon.FilePlus className="w-5 h-5 text-green-500" />
                                <span className="text-2xl font-bold text-slate-600">
                                    {lesson.homework ? (
                                        <p className="text-sm">{lesson.homework}</p>
                                    ) : (
                                        <p className="text-sm italic">{t('lessons.no_homework')}</p>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

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
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                        <Icon.MessageSquare className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-blue-600 font-medium mb-1">{t('lessons.sheikh_notes')}</p>
                            {lesson.sheikh_notes ? (
                                        <p className="text-sm text-blue-700">{lesson.sheikh_notes}</p>
                                    ) : (
                                        <p className="text-sm text-blue-400 italic">{t('lessons.no_sheikh_notes')}</p>
                                    )}
                        </div>
                    </div>

                {/* Student Notes */}
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
                        <Icon.MessageSquare className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-amber-600 font-medium mb-1">{t('lessons.student_notes')}</p>
                            {lesson.student_notes ? (
                                <p className="text-sm text-amber-700">{lesson.student_notes}</p>
                            ) : (
                                <p className="text-sm text-amber-400 italic">{t('lessons.no_student_notes')}</p>
                            )}
                        </div>
                    </div>
                    <Separator className="my-4" />
                <div className="flex justify-end items-end">
                    <AlertDialog open={editingLessonId === lesson.id} onOpenChange={(open: boolean) => setEditingLessonId(open ? lesson.id : null)}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 cursor-pointer bg-slate-400 hover:bg-slate-600">{t('lessons.update_lesson')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleUpdateSubmit}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('lessons.update_lesson')}</AlertDialogTitle>
                                <div className="flex flex-col gap-4 rtl:text-right">
                                    <div className="grid grid-cols-3 gap-4">
                                        <input type="text" name="lesson-id" value={lesson.id} readOnly hidden/>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.date'), "date", lesson.date, "date")}
                                            {updateFormSubmitted && updateState?.error?.date && <p className="text-red-500 text-sm">{updateState.error.date}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className="flex flex-col">
                                                <label htmlFor="type" className="text-sm font-medium">{t('lessons.type')}</label>
                                                <Select name="type" defaultValue={lesson.type}>
                                                    <SelectTrigger className="w-full max-w-48">
                                                        <SelectValue placeholder={t('lessons.select_a_type')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>{t('lessons.type')}</SelectLabel>
                                                            <SelectItem value={openApi.LessonType.Evaluation}>{t('lessons.evaluation')}</SelectItem>
                                                            <SelectItem value={openApi.LessonType.NewMemorization}>{t('lessons.new_memorization')}</SelectItem>
                                                            <SelectItem value={openApi.LessonType.Revision}>{t('lessons.revision')}</SelectItem>
                                                            <SelectItem value={openApi.LessonType.Makeup}>{t('lessons.makeup')}</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {updateFormSubmitted && updateState?.error?.type && <p className="text-red-500 text-sm">{updateState.error.type}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className="flex flex-col">
                                                <label htmlFor="attendance" className="text-sm font-medium">{t('lessons.attendance')}</label>
                                                <Select name="attendance" defaultValue={lesson.attendance}>
                                                    <SelectTrigger className="w-full max-w-48">
                                                        <SelectValue placeholder={t('lessons.attendance')} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>{t('lessons.attendance')}</SelectLabel>
                                                            <SelectItem value={openApi.AttendanceStatus.Present}>{t('lessons.present')}</SelectItem>
                                                            <SelectItem value={openApi.AttendanceStatus.Absent}>{t('lessons.absent')}</SelectItem>
                                                            <SelectItem value={openApi.AttendanceStatus.Excused}>{t('lessons.excused')}</SelectItem>
                                                            <SelectItem value={openApi.AttendanceStatus.Late}>{t('lessons.late')}</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {updateFormSubmitted && updateState?.error?.attendance && <p className="text-red-500 text-sm">{updateState.error.attendance}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.what_heard'), "what_is_heard_from_sheikh", lesson.what_is_heard_from_sheikh ?? '', "text")}
                                        {updateFormSubmitted && updateState?.error?.what_is_heard_from_sheikh && <p className="text-red-500 text-sm">{updateState.error.what_is_heard_from_sheikh}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.homework'), "homework", lesson.homework ?? '', "text")}
                                        {updateFormSubmitted && updateState?.error?.homework && <p className="text-red-500 text-sm">{updateState.error.homework}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.absence_reason') + " (Optional)", "absence_reason", lesson.absence_reason ?? '', "text")}
                                        {updateFormSubmitted && updateState?.error?.absence_reason && <p className="text-red-500 text-sm">{updateState.error.absence_reason}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.sheikh_notes') + " (Optional)", "sheikh_notes", lesson.sheikh_notes ?? '', "text")}
                                        {updateFormSubmitted && updateState?.error?.sheikh_notes && <p className="text-red-500 text-sm">{updateState.error.sheikh_notes}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.student_notes') + " (Optional)", "student_notes", lesson.student_notes ?? '', "text")}
                                        {updateFormSubmitted && updateState?.error?.student_notes && <p className="text-red-500 text-sm">{updateState.error.student_notes}</p>}
                                    </div>
                                    {updateFormSubmitted && updateState?.message == 'fail'? <p className="text-red-500 text-sm">{t('lessons.update_failed')}</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={updatePending} onClick={() => setUpdateFormSubmitted(false)}>{t('common.cancel')}</AlertDialogCancel>
                                <Button type="submit" disabled={updatePending}>{updatePending ? t('common.updating') : t('common.update')}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
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

    const titleElement = (
            <div className="flex flex-row justify-between my-3">
                <div id="title">
                    <p className='text-4xl text-slate-950 font-bold mb-5'>{t('lessons.lesson_history')}</p>
                </div>
                <div id="period" className="flex flex-row items-center">
                    <form className="grid grid-cols-3 gap-0">
                    </form>
                </div>
            </div>
    )

    return (
        <DashboardPage title={titleElement}>
            {content}
        </DashboardPage>
    )
}