'use client'

import React from "react";
import * as openApi from "@/lib/openApi"
import { createInvoices, createStudent, downloadInvoicePDF, getInvoice, getLocalStudent, getStudent, listInvoices, listStudents, markInvoiceAsPaid, overrideInvoice, rejectStudent, updateStudent } from "@/app/platform/actions/dashboard";
import dashboardPage from "../page";
import titleElement from "./title_element";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { dummyInvoices } from "@/lib/dummyData";
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
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

export default function Invoices() {
    const [invoices, setInvoices] = React.useState<openApi.InvoiceRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [overrideInvoiceState, overrideInvoiceAction, overrideInvoicePending] = React.useActionState(overrideInvoice, undefined)
    const [createInvoiceState, createInvoiceAction, createInvoicePending] = React.useActionState(createInvoices, undefined)
    const [getInvoiceState, getInvoiceAction, getInvoicePending] = React.useActionState(getInvoice, undefined)
    const [payInvoiceState, payInvoiceAction, payInvoicePending] = React.useActionState(markInvoiceAsPaid, undefined)
    const [createInvoiceDialogOpen, setCreateInvoiceDialogOpen] = React.useState(false)
    const [getInvoiceDialogOpen, setGetInvoiceDialogOpen] = React.useState(false)
    const [overrideInvoiceDialogOpen, setOverrideInvoiceDialogOpen] = React.useState(false)
    const [paidInvoiceDialogOpen, setPaidInvoiceDialogOpen] = React.useState(false)

    React.useEffect(() => {
        if (getInvoiceState?.message === 'success' && getInvoiceState.data) {
            setInvoices([getInvoiceState.data])
        }
    }, [getInvoiceState])

    React.useEffect(() => {
        const fetchInvoices = async () => {
            try {
                setLoading(true)
                const data = await listInvoices()
                setInvoices(data)
                setError(null)
            } catch (err) {
                setError('Failed to load library items')
                setInvoices(null)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
    }, [])

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
                <ItemDescription className="text-sm ">
                    Amount: {invoice.total_amount} {invoice.currency} , Status: {invoice.status} <br />
                    <div id="accordion-data">
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
                </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Button size="sm" variant="outline" className="transition duration-300 border-yellow-500 border text-yellow-500 bg-transparent hover:bg-yellow-500 hover:text-white" onClick={() => downloadInvoicePDF(invoice.id)}>
                        Download PDF
                    </Button>
                </ItemActions>
                    {invoice.status === openApi.InvoiceStatus.Generated ? (
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
                    ) : null}
            </Item>
        </div>
    )

    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading invoices...</p>, title: "Invoices"})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: "Invoices"})
    if (!invoices || invoices.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No invoices found.</p>, title: "Invoices"})

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
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">Sent Invoices</p>
                {sentInvoices && sentInvoices.length > 0 ? sentInvoices.map((invoice) => (
                    <div key={invoice.id}>
                        {invoiceElement(invoice, '#6a7282')}
                    </div>
                )) : <p className="text-slate-700 text-xl">No sent invoices.</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
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

    return dashboardPage({children: <div className="flex flex-col gap-4 w-full">{content}</div>, title: titleElement({
        title: "My Invoices",
        createAction: createInvoiceAction,
        createState: createInvoiceState,
        createPending: createInvoicePending,
        getInvoiceAction: getInvoiceAction,
        getInvoiceState: getInvoiceState,
        getInvoicePending: getInvoicePending,
        fieldInput: fieldInput,
        createInvoicesDialogOpen: createInvoiceDialogOpen,
        setcreateInvoicesDialogOpen: setCreateInvoiceDialogOpen,
        getInvoicesDialogOpen: getInvoiceDialogOpen,
        setgetInvoicesDialogOpen: setGetInvoiceDialogOpen,
    }
    )})
}