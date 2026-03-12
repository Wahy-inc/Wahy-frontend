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
import * as openApi from "../../../../../lib/openApi"
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";
import { CreateStudentFormState, GetStudentFormState } from "@/app/platform/lib/definitions";
import { Select, SelectGroup, SelectContent, SelectTrigger, SelectValue, SelectLabel, SelectItem } from "@/components/ui/select";
import { useLocalization } from "@/lib/localization-context";

export default function TitleElement({
    title,
    createAction,
    createPending,
    createState,
    getStudentAction,
    getStudentPending,
    getStudentState,
    fieldInput,
    createStudentDialogOpen,
    setcreateStudentDialogOpen,
    getStudentDialogOpen,
    setgetStudentDialogOpen,
}: {
        title: string,
        getStudentState: GetStudentFormState,
        getStudentAction: (formData: FormData) => void,
        getStudentPending: boolean,
        createState: CreateStudentFormState,
        createAction: (formData: FormData) => void,
        createPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        createStudentDialogOpen: boolean,
        setcreateStudentDialogOpen: (open: boolean) => void,
        getStudentDialogOpen: boolean,
        setgetStudentDialogOpen: (open: boolean) => void
    }) {
    const { t } = useLocalization()
    // Track if forms have been submitted in current dialog session
    // const [createFormSubmitted, setCreateFormSubmitted] = useState(false)
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)

    // const handleCreateSubmit = (formData: FormData) => {
    //     setCreateFormSubmitted(true)
    //     createAction(formData)
    // }

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getStudentAction(formData)
    }

    const date = new Date()

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    {/* <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">{t('students.create_student')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleCreateSubmit} id={`create-student-form-${date.getTime()}`}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('students.create_student')}</AlertDialogTitle>
                                <div className="flex flex-col gap-4 rtl:text-right">
                                <div className="flex flex-col">
                                    {fieldInput(t('students.student_id'),"id", "", "number")}
                                    {createFormSubmitted && createState?.error?.id && <p className="text-red-500 text-sm">{createState.error.id}</p>}
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.name_arabic'),"ar-name", "", "text")}
                                        {createFormSubmitted && createState?.error?.arname && <p className="text-red-500 text-sm">{createState.error.arname}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.name_english'),"en-name", "", "text")}
                                        {createFormSubmitted && createState?.error?.enname && <p className="text-red-500 text-sm">{createState.error.enname}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput(t('students.phone'),"phone", "", "text")}
                                    {createFormSubmitted && createState?.error?.phone && <p className="text-red-500 text-sm">{createState.error.phone}</p>}
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.date_of_birth'),"dateOfBirth", "", "date")}
                                        {createFormSubmitted && createState?.error?.dateOfBirth && <p className="text-red-500 text-sm">{createState.error.dateOfBirth}</p>}
                                    </div>
                                <div className='flex flex-col'>
                                    {fieldInput(t('students.timezone'),"timeZone", "", "text")}
                                    {createFormSubmitted && createState?.error?.timeZone && <p className="text-red-500 text-sm">{createState.error.timeZone}</p>}
                                </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.current_juz'),"currjuz", "", "number")}
                                        {createFormSubmitted && createState?.error?.currjuz && <p className="text-red-500 text-sm">{createState.error.currjuz}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.current_surah'),"currsurah", "", "text")}
                                        {createFormSubmitted && createState?.error?.currsurah && <p className="text-red-500 text-sm">{createState.error.currsurah}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.current_ayah'),"currayah", "", "number")}
                                        {createFormSubmitted && createState?.error?.currayah && <p className="text-red-500 text-sm">{createState.error.currayah}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3 items-center">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.lessons_per_week'),"lessonsPerWeek", "", "text")}
                                        {createFormSubmitted && createState?.error?.lessonsPerWeek && <p className="text-red-500 text-sm">{createState.error.lessonsPerWeek}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.lessons_rate'),"lessonRate", "", "number")}
                                        {createFormSubmitted && createState?.error?.lessonRate && <p className="text-red-500 text-sm">{createState.error.lessonRate}</p>}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-col w-35">
                                        <label htmlFor="billingCycle" className="text-sm font-medium">{t('students.billing_cycle')}</label>
                                            <Select name="billingCycle" disabled={createPending}>
                                                <SelectTrigger className="w-full max-w-48" >
                                                    <SelectValue placeholder={t('students.billing_cycle')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>{t('students.billing_cycle')}</SelectLabel>
                                                    <SelectItem value={openApi.BillingCycle.Weekly}>{t('students.weekly')}</SelectItem>
                                                    <SelectItem value={openApi.BillingCycle.Monthly}>{t('students.monthly')}</SelectItem>
                                                </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    {createFormSubmitted && createState?.error?.billingCycle && <p className="text-red-500 text-sm">{createState.error.billingCycle}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput(t('students.private_notes'),"privateNotes", "", "text")}
                                    {createFormSubmitted && createState?.error?.privateNotes && <p className="text-red-500 text-sm">{createState.error.privateNotes}</p>}
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput(t('students.special_notes'),"specialNotes", "", "text")}
                                    {createFormSubmitted && createState?.error?.specialNotes && <p className="text-red-500 text-sm">{createState.error.specialNotes}</p>}
                                </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={createPending}>{t('common.cancel')}</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? t('common.creating') : t('common.create')}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog> */}
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">{t('students.get_student')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('students.get_student')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('students.get_student_description')}
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput(t('students.student_id'), "student-id", t('students.enter_student_id'), "number")}
                            {getFormSubmitted && getStudentState?.message == 'fail'? <p className="text-red-500 text-sm">{t('students.get_student_failed')}</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getStudentPending}>{t('common.cancel')}</AlertDialogCancel>
                            <Button type="submit" disabled={getStudentPending}>{getStudentPending? t('common.loading') : t('students.get')}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}