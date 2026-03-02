'use client'

import React from "react";
import * as openApi from "@/lib/openApi"
import { createInvoices, downloadInvoicePDF, getInvoice, getLocalStudent, listInvoices, markInvoiceAsPaid, overrideInvoice } from "@/app/platform/actions/dashboard";
import DashboardPage from "../page";
import TitleElement from "./title_element";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {DollarSign} from 'lucide-react'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { GetInvoiceByIDFormState } from "@/app/platform/lib/definitions";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";
import { isClientOnline } from "@/lib/offlineSync";

export default function Invoices() {
    const { isAdmin, isLoading: authLoading } = useAuth()
    const [invoices, setInvoices] = React.useState<openApi.InvoiceRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [overrideInvoiceState, overrideInvoiceAction, overrideInvoicePending] = React.useActionState(overrideInvoice, undefined)
    const [createInvoiceState, createInvoiceAction, createInvoicePending] = React.useActionState(createInvoices, undefined)
    const getInvoiceAction = async (state: GetInvoiceByIDFormState, formData: FormData) => {
        return getInvoice(state, formData)
    }
    const [getInvoiceState, getInvoiceFormAction, getInvoicePending] = React.useActionState(getInvoiceAction, undefined)
    const [payInvoiceState, payInvoiceAction, payInvoicePending] = React.useActionState(markInvoiceAsPaid, undefined)
    const [createInvoiceDialogOpen, setCreateInvoiceDialogOpen] = React.useState(false)
    const [getInvoiceDialogOpen, setGetInvoiceDialogOpen] = React.useState(false)
    const [overrideInvoiceDialogOpen, setOverrideInvoiceDialogOpen] = React.useState(false)
    const [paidInvoiceDialogOpen, setPaidInvoiceDialogOpen] = React.useState(false)
    const [isOffline, setIsOffline] = React.useState(false)
    const { t } = useLocalization()

    React.useEffect(() => {
        const refreshOffline = () => setIsOffline(!isClientOnline())
        refreshOffline()
        window.addEventListener('online', refreshOffline)
        window.addEventListener('offline', refreshOffline)

        return () => {
            window.removeEventListener('online', refreshOffline)
            window.removeEventListener('offline', refreshOffline)
        }
    }, [])

    useToastListener(createInvoiceState, {functionName: 'Create Invoice', successMessage: t('invoices.create_success'), errorMessage: t('invoices.create_error')})
    useToastListener(overrideInvoiceState, {functionName: 'Override Invoice', successMessage: t('invoices.override_success'), errorMessage: t('invoices.override_error')})
    useToastListener(payInvoiceState, {functionName: 'Mark Invoice As Paid', successMessage: t('invoices.mark_paid_success'), errorMessage: t('invoices.mark_paid_error')})
    useToastListener(getInvoiceState, {functionName: 'Get Invoice', successMessage: t('invoices.get_success'), errorMessage: t('invoices.get_error')})

    React.useEffect(() => {
        if (getInvoiceState?.message === 'success' && getInvoiceState.data) {
            setInvoices([getInvoiceState.data])
        }
        if (createInvoiceState?.message === 'success' || overrideInvoiceState?.message === 'success' || payInvoiceState?.message === 'success') {
        const fetchInvoices = async () => {
            try {
                setLoading(true)
                const data = await listInvoices()
                setInvoices(data)
                setError(null)
            } catch (err) {
                setError(t('invoices.get_error'))
                setInvoices(null)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
        }
    }, [getInvoiceState, createInvoiceState, overrideInvoiceState, payInvoiceState,t])

    React.useEffect(() => {
        if (authLoading) return

        const cachedInvoices = getCachedData<openApi.InvoiceRead[]>(
            offlineCacheKeys.invoicesListAdmin,
        )
        if (cachedInvoices && cachedInvoices.length > 0) {
            setInvoices(cachedInvoices)
            setLoading(false)
        }
        
        const fetchInvoices = async () => {
            try {
                setLoading(true)
                const data = await listInvoices()
                setInvoices(data)
                setError(null)
            } catch (err) {
                setError(t('invoices.get_error'))
                setInvoices(null)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
    }, [authLoading,t])

    if (!isAdmin) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Access Denied</h1>
                        <p className="text-lg">You do not have permission to view this page.</p>
                    </div>
                </div>
            )
        }

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const invoiceElement = (invoice: openApi.InvoiceRead, color: string) => (
        <div className="flex w-full flex-col gap-6">
            <Item variant="outline" style={{borderColor: color}}>
                <ItemContent>
                    <ItemMedia variant="icon">
                        <DollarSign />
                    </ItemMedia>
                <ItemTitle>{t('invoices.invoice_id_label')}: {invoice.invoice_number} , {t('students.student_id')}: {getLocalStudent(invoice.student_id)?.full_name_english}</ItemTitle>
                    {t('invoices.amount')}: {invoice.total_amount} {invoice.currency} , {t('invoices.status')}: {invoice.status} <br />
                    <div id="accordion-data" className="text-sm">
                        <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        >
                            <AccordionItem key={invoice.id} value={invoice.id.toString()}>
                            <AccordionTrigger>{t('invoices.more_details')}</AccordionTrigger>
                            <AccordionContent>
                                {t('invoices.period_from_label')}: {invoice.period_from} {t('invoices.to')} {invoice.period_to} <br />
                                {t('invoices.generated_label')}: {invoice.generated_date}    ,    {t('invoices.due_label')}: {invoice.due_date} <br />
                                {t('invoices.payment_method')}: {invoice.payment_method}    ,    {t('invoices.reference')}: {invoice.payment_reference} <br /><br />
                                {t('invoices.payment_notes_label')}: {invoice.payment_notes}
                            </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </ItemContent>
                <ItemActions>
                    <Button disabled={isOffline} size="sm" variant="outline" className="transition duration-300 border-yellow-500 border text-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => {
                        if (isOffline) {
                            return
                        }
                        downloadInvoicePDF(invoice.id)
                    }}>
                        {t('invoices.download_pdf')}
                    </Button>
                </ItemActions>
                    <div>
                    {invoice.status === openApi.InvoiceStatus.Generated? (
                        <ItemActions>
                            <AlertDialog open={paidInvoiceDialogOpen} onOpenChange={payInvoiceState?.message == 'success'? () => setPaidInvoiceDialogOpen(false) : setPaidInvoiceDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <ItemActions>
                                        <Button size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white">
                                            {t('invoices.mark_paid')}
                                        </Button>
                                    </ItemActions>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <form action={payInvoiceAction} id={`pay-${invoice.id.toString()}`}>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>{t('invoices.mark_invoice_as_paid')}</AlertDialogTitle>
                                        <div className="flex flex-col gap-4 w-full rtl:text-right">
                                            <input hidden name="invoice_id" value={invoice.id} type="text" />
                                            <div className='flex flex-col'>
                                                {fieldInput(t('invoices.date'),"paid_date", '', "date")}
                                                {payInvoiceState?.error?.paid_date && <p className="text-red-500 text-sm">{payInvoiceState.error.paid_date}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput(t('invoices.payment_method'),"payment_method", '', "text")}
                                                {payInvoiceState?.error?.payment_method && <p className="text-red-500 text-sm">{payInvoiceState.error.payment_method}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput(t('invoices.payment_reference'),"payment_reference", '', "text")}
                                                {payInvoiceState?.error?.payment_reference && <p className="text-red-500 text-sm">{payInvoiceState.error.payment_reference}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput(t('invoices.payment_notes'),"payment_notes", '', "text")}
                                                {payInvoiceState?.error?.payment_notes && <p className="text-red-500 text-sm">{payInvoiceState.error.payment_notes}</p>}
                                            </div>
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-4">
                                        <AlertDialogCancel type="reset" disabled={payInvoicePending}>{t('common.cancel')}</AlertDialogCancel>
                                        <Button type="submit" disabled={payInvoicePending}>{payInvoicePending ? t('common.updating') : t('common.update')}</Button>
                                    </AlertDialogFooter>
                                    </form>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button size="sm" variant="outline" className="transition duration-300 border-red-500 border text-red-500 bg-transparent hover:bg-red-500 hover:text-white">
                                {t('common.cancel')}
                            </Button>
                        </ItemActions>
                    ) : null}
                    {invoice.status === openApi.InvoiceStatus.Paid ? (
                        <ItemActions>
                            <AlertDialog open={overrideInvoiceDialogOpen} onOpenChange={overrideInvoiceState?.message == 'success'? () => setOverrideInvoiceDialogOpen(false) : setOverrideInvoiceDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <ItemActions>
                                        <Button size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white">
                                            {t('invoices.override')}
                                        </Button>
                                    </ItemActions>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <form action={overrideInvoiceAction} id={`override-${invoice.id.toString()}`}>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>{t('invoices.override_invoice')}</AlertDialogTitle>
                                        <div className="flex flex-col gap-4 w-full rtl:text-right">
                                            <input hidden value={invoice.id} name="invoice_id" type="text" />
                                            <div className='flex flex-col'>
                                                {fieldInput(t('invoices.item_id'),"invoice_item_id", '', "number")}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput(t('invoices.billable'),"billable", t('invoices.yes_or_no'), "text")}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput(t('invoices.override_reason'),"override_reason", '', "text")}
                                            </div>
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-4">
                                        <AlertDialogCancel type="reset" disabled={overrideInvoicePending}>{t('common.cancel')}</AlertDialogCancel>
                                        <Button type="submit" disabled={overrideInvoicePending}>{overrideInvoicePending ? t('invoices.overriding') : t('invoices.override')}</Button>
                                    </AlertDialogFooter>
                                    </form>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button disabled={true} size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent">
                                {t('invoices.paid')}
                            </Button>
                        </ItemActions>
                    ) : null}</div>
            </Item>
        </div>
    )

    const title = (
        <TitleElement
            title={t('invoices.title')}
            createAction={createInvoiceAction}
            createState={createInvoiceState}
            createPending={createInvoicePending}
            getInvoiceAction={getInvoiceFormAction}
            getInvoiceState={getInvoiceState}
            getInvoicePending={getInvoicePending}
            fieldInput={fieldInput}
            createInvoicesDialogOpen={createInvoiceDialogOpen}
            setcreateInvoicesDialogOpen={setCreateInvoiceDialogOpen}
            getInvoicesDialogOpen={getInvoiceDialogOpen}
            setgetInvoicesDialogOpen={setGetInvoiceDialogOpen}
            disableGenerate={isOffline}
        />
    )

    if (loading) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('common.loading')}</p></DashboardPage>
    if (error) return <DashboardPage title={title}><p className="text-red-500 text-xl">{error}</p></DashboardPage>
    if (!invoices || invoices.length === 0) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('invoices.no_invoices_found')}</p></DashboardPage>

    const paidInvoices = invoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Paid;
    })
    const generatedInvoices = invoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Generated;
    })
    const cancelledInvoices = invoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Cancelled;
    })
    const overDueInvoices = invoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Overdue;
    })
    const sentInvoices = invoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Sent;
    })

    const content = (
        <div className="flex flex-col gap-12 w-full">
            {isOffline ? <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{t('invoices.offline_notice')}</p> : null}
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">{t('invoices.generated_invoices_title')}</p>
                {generatedInvoices && generatedInvoices.length > 0 ? generatedInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, '')}
                    </div>
                )) : <p className="text-slate-700 text-xl">{t('invoices.no_generated_invoices')}</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
                {sentInvoices && sentInvoices.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <p className="text-2xl text-slate-700 font-semibold">{t('invoices.sent_invoices_title')}</p>
                        {sentInvoices.map((invoice) => (
                            <div key={invoice.id}>
                                {invoiceElement(invoice, '#6a7282')}
                            </div>
                        ))}
                        <div className="w-full h-1 bg-gray-400"></div>
                    </div>
                ) : null}
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">{t('invoices.paid_invoices_title')}</p>
                {paidInvoices && paidInvoices.length > 0 ? paidInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, '#6a7282')}
                    </div>
                )) : <p className="text-slate-700 text-xl">{t('invoices.no_paid_invoices')}</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">{t('invoices.overdue_invoices_title')}</p>
                {overDueInvoices && overDueInvoices.length > 0 ? overDueInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, 'rgba(242,70,70,0.95)')}
                    </div>
                )) : <p className="text-slate-700 text-xl">{t('invoices.no_overdue_invoices')}</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">{t('invoices.cancelled_invoices_title')}</p>
                {cancelledInvoices && cancelledInvoices.length > 0 ? cancelledInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, 'rgba(242,70,70,0.95)')}
                    </div>
                )) : <p className="text-slate-700 text-xl">{t('invoices.no_cancelled_invoices')}</p>}
            </div>
        </div>
    )

    return <DashboardPage title={title}><div className="flex flex-col gap-4 w-full">{content}</div></DashboardPage>
}