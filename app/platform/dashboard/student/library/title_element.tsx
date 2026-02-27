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
import { GetLibraryItemByIDFormState } from "@/app/platform/lib/definitions";
import { useLocalization } from "@/lib/localization-context";

export default function TitleElement({
    title,
    getLibraryAction,
    getLibraryPending,
    getLibraryState,
    fieldInput,
    getLibraryDialogOpen,
    setgetLibraryDialogOpen,
}: {
        title: string,
        getLibraryState: GetLibraryItemByIDFormState,
        getLibraryAction: (formData: FormData) => void,
        getLibraryPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        getLibraryDialogOpen: boolean,
        setgetLibraryDialogOpen: (open: boolean) => void,
        disableCreate?: boolean
    }) {
    const { t } = useLocalization()
    // Track if forms have been submitted in current dialog session
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)

    const handleGetDialogOpenChange = (open: boolean) => {
        if (!open) {
            setGetFormSubmitted(false)
        }
        if (getLibraryState?.message === 'success') {
            setgetLibraryDialogOpen(false)
        } else {
            setgetLibraryDialogOpen(open)
        }
    }

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getLibraryAction(formData)
    }

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <AlertDialog open={getLibraryDialogOpen} onOpenChange={handleGetDialogOpenChange}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">{t('library.get_item')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('library.get_item')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('library.get_item_description')}
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput(t('library.item_id'), "item-id", t('library.enter_item_id'), "number")}
                            {getFormSubmitted && getLibraryState?.message == 'fail'? <p className="text-red-500 text-sm">{t('library.get_item_failed')}</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getLibraryPending}>{t('common.cancel')}</AlertDialogCancel>
                            <Button type="submit" disabled={getLibraryPending}>{getLibraryPending? t('common.loading') : t('library.get')}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}