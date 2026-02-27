import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as openApi from "@/lib/openApi";
import { useLocalization } from "@/lib/localization-context";
import React, { JSX, useState } from "react";
import { CreateLessonFormState, GetLessonByIDFormState } from "../../../lib/definitions";
import StudentMenu from "@/components/studentsMenu";
import { generateRRule, monthDays, weekDaysMap } from "../schedules/title_element";

export default function TitleElement({
    title,
    handleClearFilter,
    handleSearchStudentId,
    searchStudentId,
    createAction,
    createPending,
    createState,
    getLessonAction,
    getLessonPending,
    getLessonState,
    fieldInput,
    createLessonDialogOpen,
    setCreateLessonDialogOpen,
    getLessonDialogOpen,
    setGetLessonDialogOpen,
}: {
        title: string,
        handleSearchStudentId: (e: React.ChangeEvent<HTMLInputElement>) => void,
        searchStudentId: string,
        handleClearFilter: () => void,
        getLessonState: GetLessonByIDFormState,
        getLessonAction: (formData: FormData) => void,
        getLessonPending: boolean,
        createState: CreateLessonFormState,
        createAction: (formData: FormData) => void,
        createPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        createLessonDialogOpen: boolean,
        setCreateLessonDialogOpen: (open: boolean) => void,
        getLessonDialogOpen: boolean,
        setGetLessonDialogOpen: (open: boolean) => void,
    }) {
    // Track if forms have been submitted in current dialog session
    const [createFormSubmitted, setCreateFormSubmitted] = useState(false)
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
    const { t } = useLocalization()
    const [isRecurringPeriod, setIsRecurringPeriod] = useState<string>('')
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<string>('')
    const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string[]>([])
    const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<string>('')
    const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<string[]>([])

    const handleCreateDialogOpenChange = (open: boolean) => {
        if (!open) {
            setCreateFormSubmitted(false)
            setSelectedDayOfWeek('')     
            setSelectedDaysOfWeek([])    
            setIsRecurringPeriod('')     
        }
        if (createState?.message === 'success') {
            setCreateLessonDialogOpen(false)
        } else {
            setCreateLessonDialogOpen(open)
        }
    }

    const handleGetDialogOpenChange = (open: boolean) => {
        if (!open) {
            setGetFormSubmitted(false)
        }
        if (getLessonState?.message === 'success') {
            setGetLessonDialogOpen(false)
        } else {
            setGetLessonDialogOpen(open)
        }
    }

    const handleCreateSubmit = (formData: FormData) => {
        setCreateFormSubmitted(true)
        formData.append("student_id", selectedStudentId?.toString() || "")
        // Generate RRULE if recurring
            const rrule = generateRRule(isRecurringPeriod, selectedDayOfWeek, selectedDaysOfWeek, selectedDayOfMonth, selectedDaysOfMonth, null)
            if (rrule) {
                formData.append("rrule_string", rrule)
            }
        createAction(formData)
    }

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getLessonAction(formData)
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
                    setSelectedDaysOfWeek(selectedDaysOfWeek.filter(day => day !== key))
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
                    setSelectedDaysOfMonth(selectedDaysOfMonth.filter(d => d !== day.toString()))
                    }
                } else {
                    setSelectedDaysOfMonth([...selectedDaysOfMonth, day.toString()])
                }
            }
        }}>
            {day}
        </div>
    ))

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <Field orientation="horizontal" className='w-80'>
                            <Input onChange={handleSearchStudentId} id="student-id-search" name="student-id-search" type="search" placeholder={t('lessons.enter_student_id')} className='border-slate-950'/>
                            <div className="bg-slate-950 text-slate-100 border-slate-950 px-2 py-2 rounded-xl text-sm">{searchStudentId ? t('common.filtered') : t('common.search')}</div>
                        </Field>
                        {searchStudentId && (
                            <Button 
                                onClick={handleClearFilter}
                                variant="outline" 
                                className='transition duration-300 border border-red-500 rounded-xl text-red-500 bg-slate-100 hover:bg-red-500 hover:text-slate-100 cursor-pointer'
                            >
                                {t('common.clear')}
                            </Button>
                        )}
                    </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <div>
                    <AlertDialog open={createLessonDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">{t('lessons.create_lesson')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleCreateSubmit}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('lessons.create_lesson')}</AlertDialogTitle>
                                <div className="flex flex-col gap-4 rtl:text-right">
                                    <div className='flex flex-col'>
                                        <StudentMenu onStudentSelect={setSelectedStudentId}></StudentMenu>
                                        {createFormSubmitted && createState?.error?.student_id && <p className="text-red-500 text-sm">{createState.error.student_id}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.schedule_id'), "schedule_id", t('lessons.enter_schedule_id'), "number")}
                                        {createFormSubmitted && createState?.error?.schedule_id && <p className="text-red-500 text-sm">{createState.error.schedule_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.date'), "date", t('lessons.select_date'), "date")}
                                            {createFormSubmitted && createState?.error?.date && <p className="text-red-500 text-sm">{createState.error.date}</p>}
                                        </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="type" className="text-sm font-medium">{t('lessons.type')}</label>
                                            <Select name="type">
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
                                        {createFormSubmitted && createState?.error?.type && <p className="text-red-500 text-sm">{createState.error.type}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="attendance" className="text-sm font-medium">{t('lessons.attendance')}</label>
                                            <Select name="attendance">
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
                                        {createFormSubmitted && createState?.error?.attendance && <p className="text-red-500 text-sm">{createState.error.attendance}</p>}
                                    </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.juz'),"juz", "juz", "number")}
                                            {createFormSubmitted && createState?.error?.juz && <p className="text-red-500 text-sm">{createState.error.juz}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.surah'), "surah", "", "text")}
                                            {createFormSubmitted && createState?.error?.surah && <p className="text-red-500 text-sm">{createState.error.surah}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.ayah_from'), "ayah_from", "ayah from", "number")}
                                            {createFormSubmitted && createState?.error?.ayah_from && <p className="text-red-500 text-sm">{createState.error.ayah_from}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.ayah_to'), "ayah_to", "to", "number")}
                                            {createFormSubmitted && createState?.error?.ayah_to && <p className="text-red-500 text-sm">{createState.error.ayah_to}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="quality" className="text-sm font-medium">{t('lessons.quality')}</label>
                                            <Select name="quality">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={t('lessons.quality')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('lessons.quality')}</SelectLabel>
                                                        <SelectItem value={openApi.LessonQuality.Excellent}>{t('lessons.excellent')}</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.VeryGood}>{t('lessons.very_good')}</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.Good}>{t('lessons.good')}</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.Fair}>{t('lessons.fair')}</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.NeedsImprovement}>{t('lessons.needs_improvement')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createFormSubmitted && createState?.error?.quality && <p className="text-red-500 text-sm">{createState.error.quality}</p>}
                                    </div>
                                    <div className='flex flex-col col-start-3 col-end-4 row-start-4 row-end-5'>
                                        <div className="flex flex-col">
                                            <label htmlFor="is-recurring-period" className="text-sm font-medium">Period</label>
                                            <Select name="is-recurring-period" onValueChange={(value) => {
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
                                    </div>
                                    <div className="col-start-1 col-end-4 row-start-5 row-end-6 flex-wrap flex flex-row gap-1 rounded-xl justify-start">
                                        {(isRecurringPeriod === 'weekly' || isRecurringPeriod === 'customWeekly') && (
                                                weekElement(isRecurringPeriod)
                                            )}
                                        {(isRecurringPeriod === 'monthly' || isRecurringPeriod === 'customMonthly') && (
                                                monthElement(isRecurringPeriod)
                                            )}
                                    </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.absence_reason'), "absence_reason", t('lessons.enter_reason'), "text")}
                                        {createFormSubmitted && createState?.error?.absence_reason && <p className="text-red-500 text-sm">{createState.error.absence_reason}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.sheikh_notes'), "sheikh_notes", t('lessons.enter_sheikh_notes'), "text")}
                                        {createFormSubmitted && createState?.error?.sheikh_notes && <p className="text-red-500 text-sm">{createState.error.sheikh_notes}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.student_notes'), "student_notes", t('lessons.enter_student_notes'), "text")}
                                        {createFormSubmitted && createState?.error?.student_notes && <p className="text-red-500 text-sm">{createState.error.student_notes}</p>}
                                    </div>
                                    {createFormSubmitted && createState?.message == 'fail'? <p className="text-red-500 text-sm">{t('lessons.create_failed')}</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={createPending}>{t('common.cancel')}</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? t('common.creating') : t('common.create')}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                    <AlertDialog open={getLessonDialogOpen} onOpenChange={handleGetDialogOpenChange}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">{t('lessons.get_lesson')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('lessons.get_lesson_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('lessons.get_lesson_desc')}
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput(t('lessons.student_id'), "lesson-id", t('lessons.enter_lesson_id'), "number")}
                            {getFormSubmitted && getLessonState?.message == 'fail'? <p className="text-red-500 text-sm">{t('lessons.get_failed')}</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getLessonPending}>{t('common.cancel')}</AlertDialogCancel>
                            <Button type="submit" disabled={getLessonPending}>{getLessonPending? t('common.loading') : t('lessons.get_lesson')}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}