'use client'

import React, { use } from "react";
import * as openApi from "@/lib/openApi"
import { createInvoices, downloadInvoicePDF, downloadInvoicePDFMe, getInvoice, getInvoiceMe, getLocalStudent, listInvoices, listInvoicesMe, markInvoiceAsPaid, overrideInvoice } from "@/app/platform/actions/dashboard";
import dashboardPage from "../page";
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
import { GetInvoiceByIDFormState } from "@/app/platform/lib/definitions";
import { useToastListener } from "@/lib/toastListener";

export default function Invoices() {
    const { isAdmin, isLoading: authLoading } = useAuth()
    const [invoices, setInvoices] = React.useState<openApi.InvoiceRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [overrideInvoiceState, overrideInvoiceAction, overrideInvoicePending] = React.useActionState(overrideInvoice, undefined)
    const [createInvoiceState, createInvoiceAction, createInvoicePending] = React.useActionState(createInvoices, undefined)
    const getInvoiceAction = async (state: GetInvoiceByIDFormState, formData: FormData) => {
        return isAdmin ? getInvoice(state, formData) : getInvoiceMe(state, formData)
    }
    const [getInvoiceState, getInvoiceFormAction, getInvoicePending] = React.useActionState(getInvoiceAction, undefined)
    const [payInvoiceState, payInvoiceAction, payInvoicePending] = React.useActionState(markInvoiceAsPaid, undefined)
    const [createInvoiceDialogOpen, setCreateInvoiceDialogOpen] = React.useState(false)
    const [getInvoiceDialogOpen, setGetInvoiceDialogOpen] = React.useState(false)
    const [overrideInvoiceDialogOpen, setOverrideInvoiceDialogOpen] = React.useState(false)
    const [paidInvoiceDialogOpen, setPaidInvoiceDialogOpen] = React.useState(false)

    useToastListener(createInvoiceState, {functionName: 'Create Invoice', successMessage: 'Invoice created successfully', errorMessage: 'Failed to create invoice'})
    useToastListener(overrideInvoiceState, {functionName: 'Override Invoice', successMessage: 'Invoice overridden successfully', errorMessage: 'Failed to override invoice'})
    useToastListener(payInvoiceState, {functionName: 'Mark Invoice As Paid', successMessage: 'Invoice marked as paid successfully', errorMessage: 'Failed to mark invoice as paid'})
    useToastListener(getInvoiceState, {functionName: 'Get Invoice', successMessage: 'Invoice retrieved successfully', errorMessage: 'Failed to retrieve invoice'})

    React.useEffect(() => {
        if (getInvoiceState?.message === 'success' && getInvoiceState.data) {
            setInvoices([getInvoiceState.data])
        }
        if (createInvoiceState?.message === 'success' || overrideInvoiceState?.message === 'success' || payInvoiceState?.message === 'success') {
        const fetchInvoices = async () => {
            try {
                setLoading(true)
                if (isAdmin) {
                    const data = await listInvoices()
                    setInvoices(data)
                } else {
                    const data = await listInvoicesMe()
                    setInvoices(data)
                }
                setError(null)
            } catch (err) {
                setError('Failed to load invoices')
                setInvoices(null)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
        }
    }, [getInvoiceState, createInvoiceState, overrideInvoiceState, payInvoiceState, isAdmin])

    React.useEffect(() => {
        if (authLoading) return
        
        const fetchInvoices = async () => {
            try {
                setLoading(true)
                if (isAdmin) {
                    const data = await listInvoices()
                    setInvoices(data)
                } else {
                    const data = await listInvoicesMe()
                    setInvoices(data)
                }
                setError(null)
            } catch (err) {
                setError('Failed to load invoices')
                setInvoices(null)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
    }, [authLoading, isAdmin])

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
                <ItemTitle>Invoice ID: {invoice.invoice_number} , Student: {getLocalStudent(invoice.student_id)?.full_name_english}</ItemTitle>
                    Amount: {invoice.total_amount} {invoice.currency} , Status: {invoice.status} <br />
                    <div id="accordion-data" className="text-sm">
                        <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        >
                            <AccordionItem key={invoice.id} value={invoice.id.toString()}>
                            <AccordionTrigger>More Details</AccordionTrigger>
                            <AccordionContent>
                                Period From: {invoice.period_from} To {invoice.period_to} <br />
                                Generated: {invoice.generated_date}    ,    Due {invoice.due_date} <br />
                                Payment Method: {invoice.payment_method}    ,    Reference: {invoice.payment_reference} <br /><br />
                                Notes: {invoice.payment_notes}
                            </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </ItemContent>
                <ItemActions>
                    <Button size="sm" variant="outline" className="transition duration-300 border-yellow-500 border text-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white" onClick={() => {
                        if (isAdmin) {
                            downloadInvoicePDF(invoice.id)
                        } else {
                            downloadInvoicePDFMe(invoice.id)
                        }
                    }}>
                        Download PDF
                    </Button>
                </ItemActions>
                {isAdmin ? (
                    <div>
                    {invoice.status === openApi.InvoiceStatus.Generated? (
                        <ItemActions>
                            <AlertDialog open={paidInvoiceDialogOpen} onOpenChange={payInvoiceState?.message == 'success'? () => setPaidInvoiceDialogOpen(false) : setPaidInvoiceDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <ItemActions>
                                        <Button size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white">
                                            Mark Paid
                                        </Button>
                                    </ItemActions>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <form action={payInvoiceAction} id={`pay-${invoice.id.toString()}`}>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Mark Invoice as Paid</AlertDialogTitle>
                                        <div className="flex flex-col gap-4 w-full">
                                            <input hidden name="invoice_id" value={invoice.id} type="text" />
                                            <div className='flex flex-col'>
                                                {fieldInput("Date","paid_date", '', "date")}
                                                {payInvoiceState?.error?.paid_date && <p className="text-red-500 text-sm">{payInvoiceState.error.paid_date}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput("Payment Method","payment_method", '', "text")}
                                                {payInvoiceState?.error?.payment_method && <p className="text-red-500 text-sm">{payInvoiceState.error.payment_method}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput("Payment Reference","payment_reference", '', "text")}
                                                {payInvoiceState?.error?.payment_reference && <p className="text-red-500 text-sm">{payInvoiceState.error.payment_reference}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput("Payment Notes","payment_notes", '', "text")}
                                                {payInvoiceState?.error?.payment_notes && <p className="text-red-500 text-sm">{payInvoiceState.error.payment_notes}</p>}
                                            </div>
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-4">
                                        <AlertDialogCancel type="reset" disabled={payInvoicePending}>Cancel</AlertDialogCancel>
                                        <Button type="submit" disabled={payInvoicePending}>{payInvoicePending ? 'Updating...' : 'Update'}</Button>
                                    </AlertDialogFooter>
                                    </form>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button size="sm" variant="outline" className="transition duration-300 border-red-500 border text-red-500 bg-transparent hover:bg-red-500 hover:text-white">
                                Cancel
                            </Button>
                        </ItemActions>
                    ) : null}
                    {invoice.status === openApi.InvoiceStatus.Paid ? (
                        <ItemActions>
                            <AlertDialog open={overrideInvoiceDialogOpen} onOpenChange={overrideInvoiceState?.message == 'success'? () => setOverrideInvoiceDialogOpen(false) : setOverrideInvoiceDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <ItemActions>
                                        <Button size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white">
                                            Override
                                        </Button>
                                    </ItemActions>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <form action={overrideInvoiceAction} id={`override-${invoice.id.toString()}`}>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Override Invoice</AlertDialogTitle>
                                        <div className="flex flex-col gap-4 w-full">
                                            <input hidden value={invoice.id} name="invoice_id" type="text" />
                                            <div className='flex flex-col'>
                                                {fieldInput("Billable","billable", 'Yes or No', "text")}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput("Override Reason","override_reason", '', "text")}
                                            </div>
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-4">
                                        <AlertDialogCancel type="reset" disabled={overrideInvoicePending}>Cancel</AlertDialogCancel>
                                        <Button type="submit" disabled={overrideInvoicePending}>{overrideInvoicePending ? 'Overriding...' : 'Override'}</Button>
                                    </AlertDialogFooter>
                                    </form>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button disabled={true} size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent">
                                Paid
                            </Button>
                        </ItemActions>
                    ) : null}</div>) : null}
            </Item>
        </div>
    )

    const title = (
        <TitleElement
            title="My Invoices"
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
            isAdmin={isAdmin}
        />
    )

    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading invoices...</p>, title: title})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: title})
    if (!invoices || invoices.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No invoices found.</p>, title: title})

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
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">Generated Invoices</p>
                {generatedInvoices && generatedInvoices.length > 0 ? generatedInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, '')}
                    </div>
                )) : <p className="text-slate-700 text-xl">No generated invoices.</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
                {sentInvoices && sentInvoices.length > 0 && isAdmin ? (
                    <div className="flex flex-col gap-4">
                        <p className="text-2xl text-slate-700 font-semibold">Sent Invoices</p>
                        {sentInvoices.map((invoice) => (
                            <div key={invoice.id}>
                                {invoiceElement(invoice, '#6a7282')}
                            </div>
                        ))}
                        <div className="w-full h-1 bg-gray-400"></div>
                    </div>
                ) : null}
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">Paid Invoices</p>
                {paidInvoices && paidInvoices.length > 0 ? paidInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, '#6a7282')}
                    </div>
                )) : <p className="text-slate-700 text-xl">No paid invoices.</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">Overdue Invoices</p>
                {overDueInvoices && overDueInvoices.length > 0 ? overDueInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, 'rgba(242,70,70,0.95)')}
                    </div>
                )) : <p className="text-slate-700 text-xl">No overdue invoices.</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">Cancelled Invoices</p>
                {cancelledInvoices && cancelledInvoices.length > 0 ? cancelledInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, 'rgba(242,70,70,0.95)')}
                    </div>
                )) : <p className="text-slate-700 text-xl">No cancelled invoices.</p>}
            </div>
        </div>
    )

    return dashboardPage({children: <div className="flex flex-col gap-4 w-full">{content}</div>, title: title})
}