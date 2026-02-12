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
import React, { JSX, useState } from "react";
import { CreateInvoiceFormState, GetInvoiceByIDFormState } from "@/app/platform/lib/definitions";


export default function TitleElement({
    title,
    createAction,
    createPending,
    createState,
    getInvoiceAction,
    getInvoicePending,
    getInvoiceState,
    fieldInput,
    createInvoicesDialogOpen,
    setcreateInvoicesDialogOpen,
    getInvoicesDialogOpen,
    setgetInvoicesDialogOpen,
    isAdmin,
}: {
    title: string,
    getInvoiceState: GetInvoiceByIDFormState,
    getInvoiceAction: (formData: FormData) => void,
    getInvoicePending: boolean,
    createState: CreateInvoiceFormState,
    createAction: (formData: FormData) => void,
        createPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        createInvoicesDialogOpen: boolean,
        setcreateInvoicesDialogOpen: (open: boolean) => void,
        getInvoicesDialogOpen: boolean,
        setgetInvoicesDialogOpen: (open: boolean) => void,
        isAdmin: boolean
    }) {
    // Track if forms have been submitted in current dialog session
    const [createFormSubmitted, setCreateFormSubmitted] = useState(false)
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)

    const handleCreateDialogOpenChange = (open: boolean) => {
        if (!open) {
            setCreateFormSubmitted(false)
        }
        if (createState?.message === 'success') {
            setcreateInvoicesDialogOpen(false)
        } else {
            setcreateInvoicesDialogOpen(open)
        }
    }

    const handleGetDialogOpenChange = (open: boolean) => {
        if (!open) {
            setGetFormSubmitted(false)
        }
        if (getInvoiceState?.message === 'success') {
            setgetInvoicesDialogOpen(false)
        } else {
            setgetInvoicesDialogOpen(open)
        }
    }

    const handleCreateSubmit = (formData: FormData) => {
        setCreateFormSubmitted(true)
        createAction(formData)
    }

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
                    {isAdmin ?
                    <div>
                    <AlertDialog open={createInvoicesDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">Generate Invoice</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleCreateSubmit}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Generate Invoice</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    {fieldInput("Student ID","student_id", "", "number")}
                                    {createFormSubmitted && createState?.error?.student_id && <p className="text-red-500 text-sm">{createState.error.student_id}</p>}
                                </div>
                                <div className="flex flex-col">
                                    {fieldInput("Period from","period_from", "", "date")}
                                    {createFormSubmitted && createState?.error?.period_from && <p className="text-red-500 text-sm">{createState.error.period_from}</p>}
                                </div>
                                <div className="flex flex-col">
                                    {fieldInput("Period to","period_to", "", "date")}
                                    {createFormSubmitted && createState?.error?.period_to && <p className="text-red-500 text-sm">{createState.error.period_to}</p>}
                                </div>
                                <div className="flex flex-col">
                                    {fieldInput("Due date","due_date", "", "date")}
                                    {createFormSubmitted && createState?.error?.due_date && <p className="text-red-500 text-sm">{createState.error.due_date}</p>}
                                </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={createPending}>Cancel</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? 'Generating...' : 'Generate'}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div> : <div></div>}
                    <AlertDialog open={getInvoicesDialogOpen} onOpenChange={handleGetDialogOpenChange}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">Get Invoice</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Get Invoice</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the ID of the Invoice you want to retrieve. Make sure to enter a valid ID to get the correct information.
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput("Invoice ID", "invoice-id", "", "text")}
                            {getFormSubmitted && getInvoiceState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to fetch invoice. Please check the ID and try again.</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getInvoicePending}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={getInvoicePending}>{getInvoicePending? 'Loading...' : 'Get'}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}