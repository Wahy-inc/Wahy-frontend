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
import { JSX, useState } from "react";
import { useLocalization } from "@/lib/localization-context";
import { GetSchedualesForStudentFormState } from "@/app/platform/lib/definitions";

export default function TitleElement({
    title,
    getSchedualesForStudentAction,
    getSchedualesForStudentPending,
    getSchedualesForStudentState,
    fieldInput,
    getStudentScheduleDialogOpen,
    setgetStudentScheduleDialogOpen,
}: {
        title: string,
        getSchedualesForStudentState: GetSchedualesForStudentFormState,
        getSchedualesForStudentAction: (formData: FormData) => void,
        getSchedualesForStudentPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        getStudentScheduleDialogOpen: boolean,
        setgetStudentScheduleDialogOpen: (open: boolean) => void,
    }) {
    // Track if forms have been submitted in current dialog session
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)
    const { t } = useLocalization()

    const handleGetDialogOpenChange = (open: boolean) => {
        if (!open) {
            setGetFormSubmitted(false)
        }
        if (getSchedualesForStudentState?.message === 'success') {
            setgetStudentScheduleDialogOpen(false)
        } else {
            setgetStudentScheduleDialogOpen(open)
        }
    }

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getSchedualesForStudentAction(formData)
    }

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <AlertDialog open={getStudentScheduleDialogOpen} onOpenChange={handleGetDialogOpenChange}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">{t('schedules.get_schedules')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('schedules.get_schedules_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('schedules.get_schedules_desc')}
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput(t('schedules.student_id'), "student-id", t('schedules.enter_student_id'), "number")}
                            {getFormSubmitted && getSchedualesForStudentState?.message == 'fail'? <p className="text-red-500 text-sm">{t('schedules.get_error')}</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getSchedualesForStudentPending}>{t('common.cancel')}</AlertDialogCancel>
                            <Button type="submit" disabled={getSchedualesForStudentPending}>{getSchedualesForStudentPending? t('common.loading') : t('common.submit')}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}