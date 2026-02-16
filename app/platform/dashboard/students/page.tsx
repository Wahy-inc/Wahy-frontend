'use client'

import React, { use } from "react";
import * as openApi from "@/lib/openApi"
import { approveStudent, createStudent, getStudent, listStudents, rejectStudent, updateStudent } from "@/app/platform/actions/dashboard";
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
import {User} from 'lucide-react'
import { UpdateStudentFormState } from "../../lib/definitions";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";

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
    const [approvalStatus, setApprovalStatus] = React.useState<'success' | 'queued' | 'fail' | null>(null)
    const { isAdmin, isLoading: authLoading } = useAuth()
    const { t, language } = useLocalization()

    useToastListener(createStudentState, {functionName: "Create Student", successMessage: t('students.create_success'), errorMessage: t('students.create_error')})
    useToastListener(updateStudentState, {functionName: "Update Student", successMessage: t('students.update_success'), errorMessage: t('students.update_error')})
    useToastListener(getStudentState, {functionName: "Get Student", successMessage: t('students.create_success'), errorMessage: t('students.create_error')})
    
    React.useEffect(() => {
        if (getStudentState?.message === 'success' && getStudentState.data) {
            setStudents([getStudentState.data])
        }
        if (
            createStudentState?.message === 'success' ||
            createStudentState?.message === 'queued' ||
            updateStudentState?.message === 'success' ||
            updateStudentState?.message === 'queued'
        ) {
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
        }
    }, [getStudentState, createStudentState, updateStudentState, isAdmin])


    React.useEffect(() => {
        if (authLoading) return

        const cachedStudents = getCachedData<openApi.StudentRead[]>(offlineCacheKeys.studentsList)
        if (cachedStudents && cachedStudents.length > 0) {
            setStudents(cachedStudents)
            setLoading(false)
        }

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
    }, [isAdmin, authLoading])

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const handleApproveStudent = async (studentId: number) => {
        const status = await approveStudent(studentId, {})
        setApprovalStatus(status)

        if (status !== 'success') {
            const data = await listStudents()
            setStudents(data)
        }
    }

    const handleRejectStudent = async (studentId: number) => {
        const status = await rejectStudent(studentId, {})
        setApprovalStatus(status)

        if (status !== 'success') {
            const data = await listStudents()
            setStudents(data)
        }
    }

    const getRegistrationStatusLabel = (status: string): string => {
        const statusLower = status?.toLowerCase() || ''
        if (statusLower.includes('approved')) return t('common.yes')
        if (statusLower.includes('pending')) return t('common.no')
        if (statusLower.includes('rejected')) return t('students.reject')
        return status
    }

    const getStudentStatusLabel = (status: string): string => {
        const statusLower = status?.toLowerCase() || ''
        if (statusLower.includes('active')) return t('schedules.active')
        if (statusLower.includes('graduated')) return t('students.status_graduated')
        if (statusLower.includes('inactive')) return t('schedules.inactive')
        if (statusLower.includes('on_hold') || statusLower.includes('onhold')) return t('students.status_on_hold')
        return status
    }

    const studentElement = (student: openApi.StudentRead, color: string) => (
        <div className="flex w-full flex-col gap-6">
            <Item variant="outline" style={{borderColor: color}}>
                <ItemContent>
                    <ItemMedia variant="icon">
                        <User />
                    </ItemMedia>
                <ItemTitle>ID: {student.id} | {language === 'ar' ? student.full_name_arabic : student.full_name_english}</ItemTitle>
                    {t('students.registration_status')}: {getRegistrationStatusLabel(student.registration_status)} <br />
                    <div id="accordion-data">
                        <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        >
                            <AccordionItem key={student.id} value={student.id.toString()}>
                            <AccordionTrigger>{t('common.edit')}</AccordionTrigger>
                            <AccordionContent>
                                <div className={`space-y-6 pt-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                  {/* Contact Information */}
                                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-3 text-sm">{t('students.phone')} • {t('students.status')}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-xs text-blue-700 font-medium">{t('students.phone')}</span>
                                        <span className="text-sm text-slate-800 font-semibold">{student.phone}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs text-blue-700 font-medium">{t('students.status')}</span>
                                        <span className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-semibold w-fit">{getStudentStatusLabel(student.status)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Personal Information */}
                                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                                    <h3 className="font-semibold text-purple-900 mb-3 text-sm">{t('students.date_of_birth')} • {t('students.timezone')}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-xs text-purple-700 font-medium">{t('students.date_of_birth')}</span>
                                        <span className="text-sm text-slate-800 font-semibold">{student.date_of_birth}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs text-purple-700 font-medium">{t('students.timezone')}</span>
                                        <span className="text-sm text-slate-800 font-semibold">{student.timezone}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Memorization Progress */}
                                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-900 mb-3 text-sm">{t('students.current_juz')} • {t('students.current_surah')} • {t('students.current_ayah')}</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-xs text-green-700 font-medium">{t('students.current_juz')}</span>
                                        <span className="text-sm text-slate-800 font-semibold">{student.current_juz}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs text-green-700 font-medium">{t('students.current_surah')}</span>
                                        <span className="text-sm text-slate-800 font-semibold">{student.current_surah}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs text-green-700 font-medium">{t('students.current_ayah')}</span>
                                        <span className="text-sm text-slate-800 font-semibold">{student.current_ayah}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Lessons & Billing */}
                                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
                                    <h3 className="font-semibold text-amber-900 mb-3 text-sm">{t('students.lessons_rate')} • {t('students.lessons_per_week')} • {t('students.billing_cycle')}</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-xs text-amber-700 font-medium">{t('students.lessons_rate')}</span>
                                        <span className="text-sm text-slate-800 font-semibold">{student.lesson_rate}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs text-amber-700 font-medium">{t('students.lessons_per_week')}</span>
                                        <span className="text-sm text-slate-800 font-semibold">{student.lessons_per_week}</span>
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-xs text-amber-700 font-medium">{t('students.billing_cycle')}</span>
                                        <span className="inline-block bg-amber-200 text-amber-800 px-2 py-1 rounded text-xs font-semibold w-fit">{student.billing_cycle}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Notes */}
                                  <div className="space-y-3">
                                    {student.private_notes && (
                                      <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
                                        <span className="text-xs text-gray-700 font-medium">{t('students.private_notes')}</span>
                                        <p className="text-sm text-slate-700 mt-1">{student.private_notes}</p>
                                      </div>
                                    )}
                                    {student.special_notes && (
                                      <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
                                        <span className="text-xs text-gray-700 font-medium">{t('students.special_notes')}</span>
                                        <p className="text-sm text-slate-700 mt-1">{student.special_notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                            </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </ItemContent>
                    {student.registration_status === openApi.RegistrationStatus.Pending ? (
                        <ItemActions>
                            <Button onClick={() => void handleApproveStudent(student.id)} size="sm" variant="outline" className="transition duration-300 border-green-500 border text-green-500 bg-transparent hover:bg-green-500 hover:text-white">
                                {t('students.approve')}
                            </Button>
                            <Button onClick={() => void handleRejectStudent(student.id)} size="sm" variant="outline" className="transition duration-300 border-red-500 border text-red-500 bg-transparent hover:bg-red-500 hover:text-white">
                                {t('students.reject')}
                            </Button>
                        </ItemActions>
                    ) : null}
                    {student.registration_status === openApi.RegistrationStatus.Approved ? (
                    <AlertDialog open={updateStudentDialogOpen} onOpenChange={setUpdateStudentDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <ItemActions>
                                <Button onClick={() => (student.id, {})} size="sm" variant="outline" className="transition duration-300 border-gray-500 border text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white">
                                    {t('common.update')}
                                </Button>
                            </ItemActions>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={updateStudentAction} id={`update-${student.id}`}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('students.update_student')}</AlertDialogTitle>
                                <div className="flex flex-col gap-4 rtl:text-right">
                                <div className="flex flex-row justify-between gap-3">
                                    <input type="number" name="id" id="id" hidden value={Number(student.id)} readOnly />
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.name_arabic'),"ar-name", student.full_name_arabic, "text")}
                                        {updateStudentState?.error?.arname && <p className="text-red-500 text-sm">{updateStudentState.error.arname}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.name_english'),"en-name", student.full_name_english, "text")}
                                        {updateStudentState?.error?.enname && <p className="text-red-500 text-sm">{updateStudentState.error.enname}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput(t('students.phone'),"phone", String(student.phone), "text")}
                                    {updateStudentState?.error?.phone && <p className="text-red-500 text-sm">{updateStudentState.error.phone}</p>}
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.date_of_birth'),"date-of-birth", String(student.date_of_birth), "date")}
                                        {updateStudentState?.error?.dateOfBirth && <p className="text-red-500 text-sm">{updateStudentState.error.dateOfBirth}</p>}
                                    </div>
                                <div className='flex flex-col'>
                                    {fieldInput(t('students.timezone'),"time-zone", String(student.timezone), "text")}
                                    {updateStudentState?.error?.timeZone && <p className="text-red-500 text-sm">{updateStudentState.error.timeZone}</p>}
                                </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.current_juz'),"current-juz", String(student.current_juz), "number")}
                                        {updateStudentState?.error?.currjuz && <p className="text-red-500 text-sm">{updateStudentState.error.currjuz}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.current_surah'),"current-surah", String(student.current_surah), "text")}
                                        {updateStudentState?.error?.currsurah && <p className="text-red-500 text-sm">{updateStudentState.error.currsurah}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.current_ayah'),"current-ayah", String(student.current_ayah), "number")}
                                        {updateStudentState?.error?.currayah && <p className="text-red-500 text-sm">{updateStudentState.error.currayah}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3 items-center">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.lessons_per_week'),"lessons-per-week", String(student.lessons_per_week), "text")}
                                        {updateStudentState?.error?.lessonsPerWeek && <p className="text-red-500 text-sm">{updateStudentState.error.lessonsPerWeek}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('students.lessons_rate'),"lesson-rate", String(student.lesson_rate), "number")}
                                        {updateStudentState?.error?.lessonRate && <p className="text-red-500 text-sm">{updateStudentState.error.lessonRate}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="billing-cycle" className="text-sm font-medium">{t('students.billing_cycle')}</label>
                                            <Select name="billing-cycle" defaultValue={student.billing_cycle}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={t('common.submit')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('students.billing_cycle')}</SelectLabel>
                                                        <SelectItem value={openApi.BillingCycle.Monthly}>{t('students.monthly')}</SelectItem>
                                                        <SelectItem value={openApi.BillingCycle.Weekly}>{t('students.weekly')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateStudentState?.error?.billingCycle && <p className="text-red-500 text-sm">{updateStudentState.error.status}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3 items-center">
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="registeration-status" className="text-sm font-medium">{t('students.registration_status')}</label>
                                            <Select name="registeration-status" defaultValue={student.registration_status}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={t('common.submit')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('students.registration_status')}</SelectLabel>
                                                        <SelectItem value={openApi.RegistrationStatus.Approved}>{t('common.yes')}</SelectItem>
                                                        <SelectItem value={openApi.RegistrationStatus.Pending}>{t('common.no')}</SelectItem>
                                                        <SelectItem value={openApi.RegistrationStatus.Rejected}>{t('students.reject')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateStudentState?.error?.registerationStatus && <p className="text-red-500 text-sm">{updateStudentState.error.registerationStatus}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="status" className="text-sm font-medium">{t('students.status')}</label>
                                            <Select name="status" defaultValue={student.status}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={t('common.submit')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('students.status')}</SelectLabel>
                                                        <SelectItem value={openApi.StudentStatus.Active}>{t('common.yes')}</SelectItem>
                                                        <SelectItem value={openApi.StudentStatus.Graduated}>{t('students.reject')}</SelectItem>
                                                        <SelectItem value={openApi.StudentStatus.Inactive}>{t('schedules.inactive')}</SelectItem>
                                                        <SelectItem value={openApi.StudentStatus.OnHold}>{t('common.no')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateStudentState?.error?.status && <p className="text-red-500 text-sm">{updateStudentState.error.status}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput(t('students.private_notes'),"private-notes", String(student.private_notes), "text")}
                                    {updateStudentState?.error?.privateNotes && <p className="text-red-500 text-sm">{updateStudentState.error.privateNotes}</p>}
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput(t('students.special_notes'),"special-notes", String(student.special_notes), "text")}
                                    {updateStudentState?.error?.specialNotes && <p className="text-red-500 text-sm">{updateStudentState.error.specialNotes}</p>}
                                </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={updateStudentPending}>{t('common.cancel')}</AlertDialogCancel>
                                <Button type="submit" disabled={updateStudentPending} >{updateStudentPending ? t('common.updating') : t('common.update')}</Button>
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
            title={t('students.title')}
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

    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">{t('common.loading')}</p>, title: title})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: title})
    if (!students || students.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">{t('students.no_students_found')}</p>, title: title})

    const pendingStudents = students?.filter((student) => {
        return student.registration_status === openApi.RegistrationStatus.Pending;
    })
    const approvedStudents = students?.filter((student) => {
        return student.registration_status === openApi.RegistrationStatus.Approved;
    })
    
    const rejectedStudents = students?.filter((student) => {
        return student.registration_status === openApi.RegistrationStatus.Rejected;
    })

    const content = (
        <div className="flex flex-col gap-12 w-full">
            {(createStudentState?.message || updateStudentState?.message || approvalStatus) && (
                <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                    createStudentState?.message === 'queued' || updateStudentState?.message === 'queued' || approvalStatus === 'queued'
                        ? 'border-amber-200 bg-amber-50 text-amber-800'
                        : createStudentState?.message === 'fail' || updateStudentState?.message === 'fail' || approvalStatus === 'fail'
                            ? 'border-red-200 bg-red-50 text-red-800'
                            : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                }`}>
                    {createStudentState?.message === 'queued' || updateStudentState?.message === 'queued' || approvalStatus === 'queued'
                        ? t('schedules.offline_sync')
                        : createStudentState?.message === 'fail' || updateStudentState?.message === 'fail' || approvalStatus === 'fail'
                            ? t('schedules.offline_error')
                            : t('messages.success')}
                </div>
            )}
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">{t('students.pending_students')}</p>
                {pendingStudents && pendingStudents.length > 0 ? pendingStudents.map((student) => (
                    <div key={student.id}>
                        {studentElement(student, '')}
                    </div>
                )) : <p className="text-slate-700 text-xl">{t('students.no_pending_students')}</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">{t('students.approved_students')}</p>
                {approvedStudents && approvedStudents.length > 0 ? approvedStudents.map((student) => (
                    <div key={student.id}>
                        {studentElement(student, '#6a7282')}
                    </div>
                )) : <p className="text-slate-700 text-xl">{t('students.no_approved_students')}</p>}
            </div>
            <div className="w-full h-1 bg-gray-400"></div>
            <div className="flex flex-col gap-4">
                <p className="text-2xl text-slate-700 font-semibold">{t('students.rejected_students')}</p>
                {rejectedStudents && rejectedStudents.length > 0 ? rejectedStudents.map((student) => (
                    <div key={student.id}>
                        {studentElement(student, 'rgba(242,70,70,0.95)')}
                    </div>
                )) : <p className="text-slate-700 text-xl">{t('students.no_rejected_students')}</p>}
            </div>
        </div>
    )

    return dashboardPage({children: <div className="flex flex-col gap-4 w-full">{content}</div>, title: (
        <TitleElement
            title={t('students.title')}
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