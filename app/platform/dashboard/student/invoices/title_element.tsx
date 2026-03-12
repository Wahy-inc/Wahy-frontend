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
import { GetInvoiceByIDFormState } from "@/app/platform/lib/definitions";
import { useLocalization } from "@/lib/localization-context";


export default function TitleElement({
    title,
    getInvoiceAction,
    getInvoicePending,
    getInvoiceState,
    fieldInput,
    getInvoicesDialogOpen,
    setgetInvoicesDialogOpen,
}: {
        title: string,
        getInvoiceState: GetInvoiceByIDFormState,
        getInvoiceAction: (formData: FormData) => void,
        getInvoicePending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        getInvoicesDialogOpen: boolean,
        setgetInvoicesDialogOpen: (open: boolean) => void,
    }) {
    const { t } = useLocalization()
    // Track if forms have been submitted in current dialog session
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getInvoiceAction(formData)
    }

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">{t('invoices.get_invoice')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('invoices.get_invoice')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('invoices.get_invoice_description')}
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput(t('invoices.invoice_id'), "invoice-id", "", "text")}
                            {getFormSubmitted && getInvoiceState?.message == 'fail'? <p className="text-red-500 text-sm">{t('invoices.get_invoice_failed')}</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getInvoicePending}>{t('common.cancel')}</AlertDialogCancel>
                            <Button type="submit" disabled={getInvoicePending}>{getInvoicePending? t('common.loading') : t('invoices.get')}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}