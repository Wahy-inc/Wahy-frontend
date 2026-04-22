'use client'

import { calenderGetDayData } from "@/app/platform/actions/dashboardv2";
import { LessonRead } from "@/lib/openApi";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, XCircle, CheckCircle } from "lucide-react";
import DashboardPage from "../../page";
import { useLocalization } from "@/lib/localization-context";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as openApi from "@/lib/openApi";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as Icon from '@deemlol/next-icons';
import { updateLesson } from "@/app/platform/actions/dashboard";

function CalendarDayDataContent() {
  const searchParams = useSearchParams();
  const dayIDs = searchParams.get("dayIDs");
  const { t, language } = useLocalization();
  const [daysData, setDaysData] = React.useState<LessonRead[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = React.useState<number | null>(null);
  const [updateFormSubmitted, setUpdateFormSubmitted] = React.useState(false);
  const [updateState, updateAction, updatePending] = React.useActionState(updateLesson, undefined);
  const isRTL = language === 'ar';
  const isInitialized = React.useRef(false);
  
  React.useEffect(() => {
    if (!dayIDs || isInitialized.current) {
        if (!dayIDs) setLoading(false);
        return;
    }
    
    isInitialized.current = true;

    const fetchDayData = async () => {
      try {
        setLoading(true);
        const response = await calenderGetDayData(dayIDs.split(","));
        if (!response || response.message === 'fail' || !response.data) {
          console.error("Failed to fetch calendar day data");
          setError(t('lessons.get_error'));
          return;
        }
        const data = response.data;
        setDaysData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching calendar day data:", error);
        setDaysData(null);
        setError(t('lessons.get_error'));
      } finally {
        setLoading(false);
      }
    };

    fetchDayData();
  }, [dayIDs, t]);

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

  // Helper function to get attendance color
  const getAttendanceColor = (attendance: string): string => {
    switch (attendance) {
      case "present":
        return "bg-green-100 text-green-800 border-green-300";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "absent":
        return "bg-red-100 text-red-800 border-red-300";
      case "excused":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const lessonElement = (lesson: LessonRead) => {
    return (
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
  };

  const titleElement = (
    <div className="flex flex-row justify-between my-3">
      <div id="title">
        <p className="text-4xl text-slate-950 font-bold mb-5">{t('lessons.lesson_details')}</p>
      </div>
    </div>
  );

  if (loading) {
    return <DashboardPage title={titleElement}>
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-700 text-lg">{t('lessons.loading_lessons')}</p>
      </div>
    </DashboardPage>;
  }

  if (error) {
    return <DashboardPage title={titleElement}>
      <div className="flex items-center justify-center p-8">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    </DashboardPage>;
  }

  if (!daysData) {
    return <DashboardPage title={titleElement}>
      <div className="flex items-center justify-center p-8">
        <p className="text-slate-700 text-lg">{t('lessons.no_lessons_found')}</p>
      </div>
    </DashboardPage>;
  }

  return (
    <DashboardPage title={titleElement}>
      <div className="space-y-4">
        {daysData.map(lesson => lessonElement(lesson))}
      </div>
    </DashboardPage>
  );
}

export default function CalendarDayDataPage() {
  return (
    <Suspense fallback={<DashboardPage title={<div className="flex flex-row justify-between my-3"><div id="title"><p className="text-4xl text-slate-950 font-bold mb-5">Loading...</p></div></div>}><div className="flex items-center justify-center p-8"><p className="text-slate-700 text-lg">Loading lessons...</p></div></DashboardPage>}>
      <CalendarDayDataContent />
    </Suspense>
  );
}