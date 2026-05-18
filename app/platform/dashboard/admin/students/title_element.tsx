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
import { GetStudentFormState } from "@/app/platform/lib/definitions";
import { useLocalization } from "@/lib/localization-context";
import { useRouter } from "next/navigation";

export default function TitleElement({
    title,
    getStudentAction,
    getStudentPending,
    getStudentState,
    fieldInput,
}: {
        title: string,
        getStudentState: GetStudentFormState,
        getStudentAction: (formData: FormData) => void,
        getStudentPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
    }) {
    const { t } = useLocalization()
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)
    const router = useRouter()


    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getStudentAction(formData)
    }

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer" onClick={() => router.push("./students/signup")}>{t('students.create_student')}</Button>
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