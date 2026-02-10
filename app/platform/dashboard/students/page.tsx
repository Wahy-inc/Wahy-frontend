'use client'

import React from "react";
import { useForm } from "react-hook-form";
import * as openApi from "@/lib/openApi"
import { approveStudent, createStudent, getStudent, listStudents, rejectStudent, updateStudent } from "@/app/platform/actions/dashboard";
import dashboardPage from "../page";
import TitleElement from "./title_element";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { dummyStudents } from "@/lib/dummyData";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Students() {
    const [students, setStudents] = React.useState<openApi.StudentRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const updateStudentActionState = (state: UpdateStudentFormState, formData: FormData) => updateStudent(state, formData, Number(formData.get('id')))
    const [updateStudentState, updateStudentAction, updateStudentPending] = React.useActionState(updateStudentActionState, undefined)
    const [createStudentState, createStudentAction, createStudentPending] = React.useActionState(createStudent, undefined)
    const [getStudentState, getStudentAction, getStudentPending] = React.useActionState(getStudent, undefined)
    const [createStudentDialogOpen, setCreateStudentDialogOpen] = React.useState(false)
    const [getStudentDialogOpen, setGetStudentDialogOpen] = React.useState(false)
    const [updateStudentDialogOpen, setUpdateStudentDialogOpen] = React.useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            id: undefined,
            arname: "",
            enname: "",
            phone: "",
            dateOfBirth: "",
            timeZone: "",
            currentJuz: undefined,
            currentSurah: "",
            currentAyah: undefined,
            lessonsPerWeek: undefined,
            lessonRate: undefined,
            billingCycle: openApi.BillingCycle.Monthly,
            registrationStatus: openApi.RegistrationStatus.Pending,
            status: openApi.StudentStatus.Active,
            privateNotes: "",
            specialNotes: ""
        }
    })

    React.useEffect(() => {
        if (getStudentState?.message === 'success' && getStudentState.data) {
            setStudents([getStudentState.data])
        }
    }, [getStudentState])

    React.useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true)
                const data = await listStudents()
                setStudents(data)
                setError(null)
            } catch (err) {
                setError('Failed to load students')
                setStudents(null)
            } finally {
                setLoading(false)
            }
        }
        fetchStudents()
    }, [])

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const studentElement = (student: openApi.StudentRead, color: string) => (
        <div className="flex w-full flex-col gap-6">
            <Item variant="outline" style={{borderColor: color}}>
                <ItemContent>
                    <ItemMedia variant="icon">
                        <User />
                    </ItemMedia>
                <ItemTitle>{student.full_name_english}</ItemTitle>
                <ItemDescription>
                    Registration Status: {student.registration_status} <br />
                    <div id="accordion-data">
                        <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        >
                            <AccordionItem key={student.id} value={student.id.toString()}>
                            <AccordionTrigger>More Details</AccordionTrigger>
                            <AccordionContent>
                                Phone: {student.phone}    ,    Status: {student.status}<br />
                                Date of Birth: {student.date_of_birth}   ,   Time zone: {student.timezone}<br />
                                Juz: {student.current_juz} , Surah: {student.current_surah} , Ayah: {student.current_ayah} <br />
                                lesson Rate: {student.lesson_rate} , lessons per week: {student.lessons_per_week} <br />
                                Billing Cycle: {student.billing_cycle}    ,    <br /><br />
                                Private Notes: {student.private_notes} <br />
                                Special Notes: {student.special_notes} <br />
                            </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </ItemDescription>
                </ItemContent>
                    {student.registration_status === openApi.RegistrationStatus.Pending ? (
                        <ItemActions>
                            <Button onClick={() => approveStudent(student.id, {})} size="sm" variant="outline" className="transition duration-300 border-green-500 border text-green-500 bg-transparent hover:bg-green-500 hover:text-white">
                                Invite
                            </Button>
                            <Button onClick={() => rejectStudent(student.id, {})} size="sm" variant="outline" className="transition duration-300 border-red-500 border text-red-500 bg-transparent hover:bg-red-500 hover:text-white">
                                Reject
                            </Button>
                        </ItemActions>
                    ) : null}
                    {student.registration_status === openApi.RegistrationStatus.Approved ? (
                    <AlertDialog open={updateStudentDialogOpen} onOpenChange={updateStudentState?.message == 'success'? () => setUpdateStudentDialogOpen(false) : setUpdateStudentDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <ItemActions>
                                <Button onClick={() => (student.id, {})} size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white">
                                    Update
                                </Button>
                            </ItemActions>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={updateStudentAction} id={`update-${student.id}`}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Student</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput("Name in Arabic","ar-name", student.full_name_arabic, "text")}
                                        {updateStudentState?.error?.arname && <p className="text-red-500 text-sm">{updateStudentState.error.arname}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Name in English","en-name", student.full_name_english, "text")}
                                        {updateStudentState?.error?.enname && <p className="text-red-500 text-sm">{updateStudentState.error.enname}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput("Phone","phone", String(student.phone), "text")}
                                    {updateStudentState?.error?.phone && <p className="text-red-500 text-sm">{updateStudentState.error.phone}</p>}
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput("Date of Birth","date-of-birth", String(student.date_of_birth), "date")}
                                        {updateStudentState?.error?.dateOfBirth && <p className="text-red-500 text-sm">{updateStudentState.error.dateOfBirth}</p>}
                                    </div>
                                <div className='flex flex-col'>
                                    {fieldInput("Timezone","timezone", String(student.timezone), "text")}
                                    {updateStudentState?.error?.timeZone && <p className="text-red-500 text-sm">{updateStudentState.error.timeZone}</p>}
                                </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput("Current juz","current-juz", String(student.current_juz), "number")}
                                        {updateStudentState?.error?.currjuz && <p className="text-red-500 text-sm">{updateStudentState.error.currjuz}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Current surah","current-surah", String(student.current_surah), "text")}
                                        {updateStudentState?.error?.currsurah && <p className="text-red-500 text-sm">{updateStudentState.error.currsurah}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Current ayah","current-ayah", String(student.current_ayah), "number")}
                                        {updateStudentState?.error?.currayah && <p className="text-red-500 text-sm">{updateStudentState.error.currayah}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3 items-center">
                                    <div className='flex flex-col'>
                                        {fieldInput("Lessons per week","lessons-per-week", String(student.lessons_per_week), "text")}
                                        {updateStudentState?.error?.lessonsPerWeek && <p className="text-red-500 text-sm">{updateStudentState.error.lessonsPerWeek}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Lesson rate","lesson-rate", String(student.lesson_rate), "number")}
                                        {updateStudentState?.error?.lessonRate && <p className="text-red-500 text-sm">{updateStudentState.error.lessonRate}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="billing-cycle" className="text-sm font-medium">Billing Cycle</label>
                                            <Select name="billing-cycle" defaultValue={student.billing_cycle}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Billing Cycle</SelectLabel>
                                                        <SelectItem value={openApi.BillingCycle.Monthly}>Monthly</SelectItem>
                                                        <SelectItem value={openApi.BillingCycle.Weekly}>Weekly</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateStudentState?.error?.status && <p className="text-red-500 text-sm">{updateStudentState.error.status}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3 items-center">
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="registration-status" className="text-sm font-medium">Registration Status</label>
                                            <Select name="registration-status" defaultValue={student.registration_status}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Registration Status</SelectLabel>
                                                        <SelectItem value={openApi.RegistrationStatus.Approved}>Approved</SelectItem>
                                                        <SelectItem value={openApi.RegistrationStatus.Pending}>Pending</SelectItem>
                                                        <SelectItem value={openApi.RegistrationStatus.Rejected}>Rejected</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateStudentState?.error?.status && <p className="text-red-500 text-sm">{updateStudentState.error.status}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="status" className="text-sm font-medium">Student Status</label>
                                            <Select name="status" defaultValue={student.status}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Student Status</SelectLabel>
                                                        <SelectItem value={openApi.StudentStatus.Active}>Evaluation</SelectItem>
                                                        <SelectItem value={openApi.StudentStatus.Graduated}>Graduated</SelectItem>
                                                        <SelectItem value={openApi.StudentStatus.Inactive}>Inactive</SelectItem>
                                                        <SelectItem value={openApi.StudentStatus.OnHold}>OnHold</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateStudentState?.error?.status && <p className="text-red-500 text-sm">{updateStudentState.error.status}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput("Private notes","private-notes", String(student.private_notes), "text")}
                                    {updateStudentState?.error?.privateNotes && <p className="text-red-500 text-sm">{updateStudentState.error.privateNotes}</p>}
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput("Special notes","special-notes", String(student.special_notes), "text")}
                                    {updateStudentState?.error?.specialNotes && <p className="text-red-500 text-sm">{updateStudentState.error.specialNotes}</p>}
                                </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={updateStudentPending} onClick={() => reset()}>Cancel</AlertDialogCancel>
                                <Button type="submit" disabled={updateStudentPending} onSubmit={handleSubmit(() => reset())}>{updateStudentPending ? 'Updating...' : 'Update'}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    ) : null}
            </Item>
        </div>
    )

    const title = (
        <TitleElement
            title="My Students"
            createAction={createStudentAction}
            createState={createStudentState}
            createPending={createStudentPending}
            getStudentAction={getStudentAction}
            getStudentState={getStudentState}
            getStudentPending={getStudentPending}
            fieldInput={fieldInput}
            createStudentDialogOpen={createStudentDialogOpen}
            setcreateStudentDialogOpen={setCreateStudentDialogOpen}
            getStudentDialogOpen={getStudentDialogOpen}
            setgetStudentDialogOpen={setGetStudentDialogOpen}
        />
    )

    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading students...</p>, title: title})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: title})
    if (!students || students.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No students found.</p>, title: title})

    const pendingStudents = dummyStudents?.filter((student) => {
        return student.registration_status === openApi.RegistrationStatus.Pending;
    })
    const approvedStudents = dummyStudents?.filter((student) => {
        return student.registration_status === openApi.RegistrationStatus.Approved;
    })
    
    const rejectedStudents = dummyStudents?.filter((student) => {
        return student.registration_status === openApi.RegistrationStatus.Rejected;
    })

    const content = (
        <div className="flex flex-col gap-12 w-full">
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">Pending Students</p>
                {pendingStudents && pendingStudents.length > 0 ? pendingStudents.map((student) => (
                    <div key={student.id}>
                        {studentElement(student, '')}
                    </div>
                )) : <p className="text-slate-700 text-xl">No pending students.</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">Approved Students</p>
                {approvedStudents && approvedStudents.length > 0 ? approvedStudents.map((student) => (
                    <div key={student.id}>
                        {studentElement(student, '#6a7282')}
                    </div>
                )) : <p className="text-slate-700 text-xl">No approved students.</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">Rejected Students</p>
                {rejectedStudents && rejectedStudents.length > 0 ? rejectedStudents.map((student) => (
                    <div key={student.id}>
                        {studentElement(student, 'rgba(242,70,70,0.95)')}
                    </div>
                )) : <p className="text-slate-700 text-xl">No rejected students.</p>}
            </div>
        </div>
    )

    return dashboardPage({children: <div className="flex flex-col gap-4 w-full">{content}</div>, title: (
        <TitleElement
            title="My Students"
            createAction={createStudentAction}
            createState={createStudentState}
            createPending={createStudentPending}
            getStudentAction={getStudentAction}
            getStudentState={getStudentState}
            getStudentPending={getStudentPending}
            fieldInput={fieldInput}
            createStudentDialogOpen={createStudentDialogOpen}
            setcreateStudentDialogOpen={setCreateStudentDialogOpen}
            getStudentDialogOpen={getStudentDialogOpen}
            setgetStudentDialogOpen={setGetStudentDialogOpen}
        />
    )})
}