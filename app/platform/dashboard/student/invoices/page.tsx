'use client'

import React from "react";
import * as openApi from "@/lib/openApi"
import { downloadInvoicePDFMe, getInvoiceMe, listInvoicesMe } from "@/app/platform/actions/dashboard";
import DashboardPage from "../../admin/page";
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
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { GetInvoiceByIDFormState } from "@/app/platform/lib/definitions";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";
import { isClientOnline } from "@/lib/offlineSync";

export default function Invoices() {
    const { isLoading: authLoading } = useAuth()
    const [invoices, setInvoices] = React.useState<openApi.InvoiceRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const getInvoiceAction = async (state: GetInvoiceByIDFormState, formData: FormData) => {
        return getInvoiceMe(state, formData)
    }
    const [getInvoiceState, getInvoiceFormAction, getInvoicePending] = React.useActionState(getInvoiceAction, undefined)
    const [getInvoiceDialogOpen, setGetInvoiceDialogOpen] = React.useState(false)
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

    useToastListener(getInvoiceState, {functionName: 'Get Invoice', successMessage: t('invoices.get_success'), errorMessage: t('invoices.get_error')})

    React.useEffect(() => {
        if (getInvoiceState?.message === 'success' && getInvoiceState.data) {
            setInvoices([getInvoiceState.data])
        }
    }, [getInvoiceState, t])

    React.useEffect(() => {
        if (authLoading) return

        const cachedInvoices = getCachedData<openApi.InvoiceRead[]>(
            offlineCacheKeys.invoicesListMe,
        )
        if (cachedInvoices && cachedInvoices.length > 0) {
            setInvoices(cachedInvoices)
            setLoading(false)
        }
        
        const fetchInvoices = async () => {
            try {
                setLoading(true)
                const data = await listInvoicesMe()
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
                <ItemTitle>{t('invoices.invoice_id_label')}: {invoice.invoice_number} , {t('students.student_id')}: {t('invoices.me')}</ItemTitle>
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
                        downloadInvoicePDFMe(invoice.id)
                    }}>
                        {t('invoices.download_pdf')}
                    </Button>
                </ItemActions>
            </Item>
        </div>
    )

    const title = (
        <TitleElement
            title={t('invoices.title')}
            getInvoiceAction={getInvoiceFormAction}
            getInvoiceState={getInvoiceState}
            getInvoicePending={getInvoicePending}
            fieldInput={fieldInput}
            getInvoicesDialogOpen={getInvoiceDialogOpen}
            setgetInvoicesDialogOpen={setGetInvoiceDialogOpen}
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