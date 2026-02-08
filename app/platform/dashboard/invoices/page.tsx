'use client'

import React from "react";
import { useForm } from "react-hook-form";
import * as openApi from "@/lib/openApi"
import { approveStudent, createStudent, getStudent, listInvoices, listStudents, rejectStudent, updateStudent } from "@/app/platform/actions/dashboard";
import dashboardPage from "../page";
import titleElement from "./title_element";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { dummyInvoices, dummyStudents } from "@/lib/dummyData";
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {User} from 'lucide-react'
import { UpdateStudentFormState } from "../../lib/definitions";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Invoices() {
    const [invoices, setInvoices] = React.useState<openApi.InvoiceRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const updateStudentActionState = (state: UpdateStudentFormState, formData: FormData) => updateStudent(state, formData, Number(formData.get('id')))
    const [updateStudentState, updateStudentAction, updateStudentPending] = React.useActionState(updateStudentActionState, undefined)
    const [createStudentState, createStudentAction, createStudentPending] = React.useActionState(createStudent, undefined)
    const [getStudentState, getStudentAction, getStudentPending] = React.useActionState(getStudent, undefined)
    const [createStudentDialogOpen, setCreateStudentDialogOpen] = React.useState(false)
    const [getStudentDialogOpen, setGetStudentDialogOpen] = React.useState(false)
    const [updateStudentDialogOpen, setUpdateStudentDialogOpen] = React.useState(false)

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
                        <User />
                    </ItemMedia>
                <ItemTitle>{invoice.invoice_number}</ItemTitle>
                <ItemDescription>
                    Amount: {invoice.total_amount} {invoice.currency} , Status: {invoice.status} <br />
                    Period From: {invoice.period_from} To {invoice.period_to} , Generated: {invoice.generated_date} , Due {invoice.due_date} <br />
                    Payment Method: {invoice.payment_method} , Reference: {invoice.payment_reference} <br /><br />
                    Notes: {invoice.payment_notes}
                </ItemDescription>
                </ItemContent>
                    {invoice.status === openApi.InvoiceStatus.Generated ? (
                        <ItemActions>
                            <AlertDialog open={updateStudentDialogOpen} onOpenChange={updateStudentState?.message == 'success'? () => setUpdateStudentDialogOpen(false) : setUpdateStudentDialogOpen}>
                                <AlertDialogTrigger asChild>
                                    <ItemActions>
                                        <Button size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white">
                                            Mark Paid
                                        </Button>
                                    </ItemActions>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <form action={updateStudentAction}>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Create Student</AlertDialogTitle>
                                        <div className="flex flex-col gap-4 w-full">
                                            <div className='flex flex-col'>
                                                {fieldInput("Date","date", '', "date")}
                                                {updateStudentState?.error?.arname && <p className="text-red-500 text-sm">{updateStudentState.error.arname}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput("Payment Method","payment_method", '', "text")}
                                                {updateStudentState?.error?.enname && <p className="text-red-500 text-sm">{updateStudentState.error.enname}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput("Payment Reference","payment_reference", '', "text")}
                                                {updateStudentState?.error?.enname && <p className="text-red-500 text-sm">{updateStudentState.error.enname}</p>}
                                            </div>
                                            <div className='flex flex-col'>
                                                {fieldInput("Payment Notes","payment_notes", '', "text")}
                                                {updateStudentState?.error?.enname && <p className="text-red-500 text-sm">{updateStudentState.error.enname}</p>}
                                            </div>
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="mt-4">
                                        <AlertDialogCancel type="reset" disabled={updateStudentPending}>Cancel</AlertDialogCancel>
                                        <Button type="submit" disabled={updateStudentPending}>{updateStudentPending ? 'Updating...' : 'Update'}</Button>
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
                            <Button disabled={true} size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent">
                                Paid
                            </Button>
                    ) : null}
            </Item>
        </div>
    )

    // if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading schedules...</p>, title: "Schedules"})
    // if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: "Schedules"})
    // if (!schedules || schedules.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No schedules found.</p>, title: "Schedules"})

    const paidInvoices = dummyInvoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Paid;
    })
    const generatedInvoices = dummyInvoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Generated;
    })
    const cancelledInvoices = dummyInvoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Cancelled;
    })
    const overDueInvoices = dummyInvoices?.filter((invoice) => {
        return invoice.status === openApi.InvoiceStatus.Overdue;
    })
    const sentInvoices = dummyInvoices?.filter((invoice) => {
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
        createAction: createStudentAction,
        createState: createStudentState,
        createPending: createStudentPending,
        getStudentAction: getStudentAction,
        getStudentState: getStudentState,
        getStudentPending: getStudentPending,
        fieldInput: fieldInput,
        createStudentDialogOpen: createStudentDialogOpen,
        setcreateStudentDialogOpen: setCreateStudentDialogOpen,
        getStudentDialogOpen: getStudentDialogOpen,
        setgetStudentDialogOpen: setGetStudentDialogOpen,
    }
    )})
}