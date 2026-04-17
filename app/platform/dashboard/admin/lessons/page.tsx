'use client'

import React, { useActionState } from "react";
import * as openApi from "@/lib/openApi"
import { createLesson, getLessonByDay, listLessons, updateLesson } from "@/app/platform/actions/dashboard";
import DashboardPage from "../page";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateLessonFormState, GetLessonByDayFormState } from "@/app/platform/lib/definitions";
import LessonElement from "./lesson_element";
import TitleElement from "./title_element";
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";
import { dummyClassGroupItems } from "@/lib/dummydata";
import { useRouter } from "next/navigation";


export default function Lessons() {
    const {isAdmin, isLoading: authLoading } = useAuth()
    const { t } = useLocalization()
    const router = useRouter()
    const [lessons, setLessons] = React.useState<openApi.ClassGroupListResponse | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [createState, createAction, createPending] = useActionState(createLesson, undefined)
    const updateLessonAction = (state: UpdateLessonFormState, formData: FormData) => updateLesson(state, formData, Number(formData.get('lesson-id')))
    const [updateState, updateAction, updatePending] = useActionState(updateLessonAction, undefined)
    const getLessonAction = async (state: GetLessonByDayFormState, formData: FormData) => {
        return getLessonByDay(state, formData)
    }
    const [getLessonState, getLessonFormAction, getLessonPending] = useActionState(getLessonAction, undefined)
    const [fetchedLessons, setFetchedLessons] = React.useState<openApi.ClassGroupItem[] | null>(null)
    const [getLessonDialogOpen, setGetLessonDialogOpen] = React.useState(false)
    const [createLessonDialogOpen, setCreateLessonDialogOpen] = React.useState(false)
    const [updateLessonDialogOpen, setUpdateLessonDialogOpen] = React.useState(false)
    const [searchStudentId, setSearchStudentId] = React.useState<string>("")
    const [filteredLessons, setFilteredLessons] = React.useState<openApi.ClassGroupItem[] | null>(null)

    useToastListener(createState, {functionName: "Create Lesson", successMessage: t('lessons.create_success'), errorMessage: t('lessons.create_error')})
    useToastListener(updateState, {functionName: "Update Lesson", successMessage: t('lessons.update_success'), errorMessage: t('lessons.update_error')})
    useToastListener(getLessonState, {functionName: "Get Lesson", successMessage: t('lessons.get_success'), errorMessage: t('lessons.get_error')})
    
    React.useEffect(() => {
        if (authLoading) return

        const cachedLessons = getCachedData<openApi.ClassGroupListResponse>(
            offlineCacheKeys.lessonsListAdmin,
        )
        if (cachedLessons && cachedLessons?.classes?.length > 0) {
            setLessons(cachedLessons)
            setLoading(false)
        }
        
        const fetchLessons = async () => {
            try {
                setLoading(true)
                const data = await listLessons()
                setLessons(data)
                setError(null)
            } catch (err) {
                setError(t('lessons.loading_lessons'))
                setLessons(null)
            } finally {
                setLoading(false)
            }
        }
        fetchLessons()
    }, [authLoading, t])

    React.useEffect(() => {
        if (getLessonState?.message == 'success' && getLessonState.data) {
            setFetchedLessons(getLessonState.data)
        }
        if (
            createState?.message === 'success' ||
            createState?.message === 'queued' ||
            updateState?.message === 'success' ||
            updateState?.message === 'queued'
        ) {
            const fetchLessons = async () => {
                try {
                    setLoading(true)
                    const data = await listLessons()
                    setLessons(data)
                    setError(null)
                } catch (err) {
                    setError(t('lessons.loading_lessons'))
                    setLessons(null)
                } finally {
                    setLoading(false)
                }
            }
            fetchLessons()
        }
    }, [getLessonState, createState, updateState, t])

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

    const handleSearchStudentId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const studentId = e.target.value.trim()
        setSearchStudentId(studentId)
        
        if (studentId === "") {
            setFilteredLessons(null)
        } else if (dummyClassGroupItems) {
            const filtered = dummyClassGroupItems.filter(lesson => 
                lesson.student_id.toString().startsWith(studentId)
            )
            setFilteredLessons(filtered)
        }
    }

    const handleClearFilter = () => {
        setSearchStudentId("")
        setFilteredLessons(null)
        const searchInput = document.getElementById("student-id-search") as HTMLInputElement
        if (searchInput) {
            searchInput.value = ""
        }
    }

    const content = dummyClassGroupItems?.map((lesson) => (
        <div key={`lesson-${lesson.schedule_id}-${lesson.student_id}`} onClick={() => router.push(`/platform/dashboard/admin/lessons/lessonData?scheduleID=${lesson.schedule_id}&studentID=${lesson.student_id}`)}>
            <LessonElement lesson={lesson} updateAction={updateAction} updateState={updateState} updatePending={updatePending} setUpdateLessonDialogOpen={setUpdateLessonDialogOpen} updateLessonDialogOpen={updateLessonDialogOpen} fieldInput={fieldInput} />
        </div>
    ))

    let displayContent = content
    let displayTitle = t('lessons.title')

    if (searchStudentId && filteredLessons) {
        if (filteredLessons?.length === 0) {
            displayContent = [<p key="no-lessons" className="text-slate-700 text-xl">{t('lessons.no_lessons_found')} {searchStudentId}</p>]
            displayTitle = `${t('lessons.title')} - Student ${searchStudentId}`
        } else {
            displayContent = filteredLessons.map((lesson) => (
                <div key={`lesson-${lesson.schedule_id}-${lesson.student_id}`} onClick={() => router.push(`/platform/dashboard/admin/lessons/lessonData?scheduleID=${lesson.schedule_id}&studentID=${lesson.student_id}`)}>
                    <LessonElement lesson={lesson} updateAction={updateAction} updateState={updateState} updatePending={updatePending} setUpdateLessonDialogOpen={setUpdateLessonDialogOpen} updateLessonDialogOpen={updateLessonDialogOpen} fieldInput={fieldInput} />
                </div>
            ))
            displayTitle = `${t('lessons.title')} - Student ${searchStudentId} (${filteredLessons?.length})`
        }
    }

    const title = (
        <TitleElement
            title={displayTitle}
            handleSearchStudentId={handleSearchStudentId}
            searchStudentId={searchStudentId}
            handleClearFilter={handleClearFilter}
            getLessonState={getLessonState}
            getLessonAction={getLessonFormAction}
            getLessonPending={getLessonPending}
            createState={createState}
            createAction={createAction}
            createPending={createPending}
            fieldInput={fieldInput}
            createLessonDialogOpen={createLessonDialogOpen}
            setCreateLessonDialogOpen={setCreateLessonDialogOpen}
            getLessonDialogOpen={getLessonDialogOpen}
            setGetLessonDialogOpen={setGetLessonDialogOpen}
        />
    )


    if (loading) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('lessons.loading_lessons')}</p></DashboardPage>
    if (error) return <DashboardPage title={title}><p className="text-red-500 text-xl">{error}</p></DashboardPage>
    if (!lessons || lessons.classes?.length === 0) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('common.no_data_found')}</p></DashboardPage>

    const actionStatusBanner = (createState?.message || updateState?.message) ? (
        <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            createState?.message === 'queued' || updateState?.message === 'queued'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : createState?.message === 'fail' || updateState?.message === 'fail'
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
        }`}>
            {createState?.message === 'queued' || updateState?.message === 'queued'
                ? t('lessons.offline_sync')
                : createState?.message === 'fail' || updateState?.message === 'fail'
                    ? t('lessons.offline_error')
                    : t('messages.success')}
        </div>
    ) : null

    if (fetchedLessons && getLessonState?.message == 'success') {
        return <DashboardPage title={(
            <TitleElement
                title={`${t('lessons.lesson_details')} ${fetchedLessons?.length? `(${fetchedLessons.length})` : ''}`}
                createAction={createAction}
                createState={createState}
                createPending={createPending}
                setCreateLessonDialogOpen={setCreateLessonDialogOpen}
                createLessonDialogOpen={createLessonDialogOpen}
                fieldInput={fieldInput}
                getLessonDialogOpen={getLessonDialogOpen}
                setGetLessonDialogOpen={setGetLessonDialogOpen}
                handleSearchStudentId={handleSearchStudentId}
                searchStudentId={searchStudentId}
                handleClearFilter={handleClearFilter}
                getLessonState={getLessonState}
                getLessonAction={getLessonFormAction}
                getLessonPending={getLessonPending}
            />
        )}>
            <div className='mx-10'>{actionStatusBanner}</div>
            <div className='flex flex-row justify-end'>
                <Button variant="outline" className='transition duration-300 mx-10 mt-4 mb-2 border border-red-500 rounded-xl text-red-500 bg-slate-100 cursor-pointer hover:bg-red-500 hover:text-slate-100' onClick={() => {setFetchedLessons([])}}>{t('common.clear')}</Button>
            </div>
            <div>
                {fetchedLessons?.length === 0 ? (
                    <p className="text-slate-700 text-xl">{t('lessons.no_lessons_found')}</p>
                ) : (
                    fetchedLessons.map((lesson) => (
                        <div key={`lesson-${lesson.schedule_id}-${lesson.student_id}`}>
                            <LessonElement lesson={lesson} updateAction={updateAction} updateState={updateState} updatePending={updatePending} setUpdateLessonDialogOpen={setUpdateLessonDialogOpen} updateLessonDialogOpen={updateLessonDialogOpen} fieldInput={fieldInput} />
                        </div>
                    ))
                )}
            </div>
        </DashboardPage>
    } else {
        return <DashboardPage title={title}>
            <div>{actionStatusBanner}</div>
            <div>{displayContent}</div>
        </DashboardPage>
    }

}