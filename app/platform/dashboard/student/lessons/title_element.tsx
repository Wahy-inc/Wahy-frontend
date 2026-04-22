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
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/lib/localization-context";
import React, { JSX, useState } from "react";
import { GetLessonByDayFormState } from "../../../lib/definitions";

export default function TitleElement({
    title,
    getLessonAction,
    getLessonPending,
    getLessonState,
    fieldInput,
}: {
        title: string,
        getLessonState: GetLessonByDayFormState,
        getLessonAction: (formData: FormData) => void,
        getLessonPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
    }) {
    // Track if forms have been submitted in current dialog session
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)
    const { t } = useLocalization()

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getLessonAction(formData)
    }

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <AlertDialog>
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
                            {fieldInput(t('lessons.lesson_day'), "lesson-day", t('lessons.enter_lesson_day'), "text")}
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