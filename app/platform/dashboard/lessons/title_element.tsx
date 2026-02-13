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
import { CreateLessonFormState, GetLessonByIDFormState } from "../../lib/definitions";

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
    isAdmin
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
        isAdmin: boolean
    }) {
    // Track if forms have been submitted in current dialog session
    const [createFormSubmitted, setCreateFormSubmitted] = useState(false)
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)
    const { t } = useLocalization()

    const handleCreateDialogOpenChange = (open: boolean) => {
        if (!open) {
            setCreateFormSubmitted(false)
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
        createAction(formData)
    }

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getLessonAction(formData)
    }

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                    {isAdmin ?
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
                    </div> : <div></div>}
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    {isAdmin ?
                    <div>
                    <AlertDialog open={createLessonDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">{t('lessons.create_lesson')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleCreateSubmit}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('lessons.create_lesson')}</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.student_id'),"student_id", t('lessons.enter_student_id'), "number")}
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
                                                        <SelectLabel>Type</SelectLabel>
                                                        <SelectItem value={openApi.LessonType.Evaluation}>Evaluation</SelectItem>
                                                        <SelectItem value={openApi.LessonType.NewMemorization}>New Memorization</SelectItem>
                                                        <SelectItem value={openApi.LessonType.Revision}>Revision</SelectItem>
                                                        <SelectItem value={openApi.LessonType.Makeup}>Makeup</SelectItem>
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
                                                    <SelectValue placeholder="Attendance" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Attendance</SelectLabel>
                                                        <SelectItem value={openApi.AttendanceStatus.Present}>Present</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Absent}>Absent</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Excused}>Excused</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Late}>Late</SelectItem>
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
                                                        <SelectLabel>Quality</SelectLabel>
                                                        <SelectItem value={openApi.LessonQuality.Excellent}>Excellent</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.VeryGood}>Very Good</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.Good}>Good</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.Fair}>Fair</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.NeedsImprovement}>Needs Improvement</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createFormSubmitted && createState?.error?.quality && <p className="text-red-500 text-sm">{createState.error.quality}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="pass_fail" className="text-sm font-medium">{t('lessons.pass_fail')}</label>
                                            <Select name="pass_fail">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={t('lessons.select_pass_fail')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Pass/Fail</SelectLabel>
                                                        <SelectItem value="true">Pass</SelectItem>
                                                        <SelectItem value="false">Fail</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createFormSubmitted && createState?.error?.pass_fail && <p className="text-red-500 text-sm">{createState.error.pass_fail}</p>}
                                    </div>

                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.attempts'), "attempts", "attempts", "number")}
                                            {createFormSubmitted && createState?.error?.attempts && <p className="text-red-500 text-sm">{createState.error.attempts}</p>}
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
                    </div> : <div></div>}
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