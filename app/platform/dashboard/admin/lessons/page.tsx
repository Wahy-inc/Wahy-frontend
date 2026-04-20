'use client'

import React, { useActionState } from "react";
import * as openApi from "@/lib/openApi"
import { createLesson, getLessonByDay, listLessons } from "@/app/platform/actions/dashboard";
import DashboardPage from "../page";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetLessonByDayFormState } from "@/app/platform/lib/definitions";
import LessonElement from "./lesson_element";
import TitleElement from "./title_element";
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";
import { useRouter } from "next/navigation";


export default function Lessons() {
    const {isAdmin, isLoading: authLoading } = useAuth()
    const { t } = useLocalization()
    const router = useRouter()
    const [lessons, setLessons] = React.useState<openApi.LessonRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [createState, createAction, createPending] = useActionState(createLesson, undefined)
    const getLessonAction = async (state: GetLessonByDayFormState, formData: FormData) => {
        return getLessonByDay(state, formData)
    }
    const [getLessonState, getLessonFormAction, getLessonPending] = useActionState(getLessonAction, undefined)
    const [fetchedLessons, setFetchedLessons] = React.useState<openApi.LessonRead[] | null>(null)
    const [searchStudentId, setSearchStudentId] = React.useState<string>("")
    const [filteredLessons, setFilteredLessons] = React.useState<openApi.LessonRead[] | null>(null)

    useToastListener(createState, {functionName: "Create Lesson", successMessage: t('lessons.create_success'), errorMessage: t('lessons.create_error')})
    useToastListener(getLessonState, {functionName: "Get Lesson", successMessage: t('lessons.get_success'), errorMessage: t('lessons.get_error')})
    
    React.useEffect(() => {
        if (authLoading) return

        const cachedLessons = getCachedData<openApi.LessonRead[]>(
            offlineCacheKeys.lessonsListAdmin,
        )
        if (cachedLessons && cachedLessons?.length > 0) {
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
            createState?.message === 'queued'
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
    }, [getLessonState, createState, t])

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
        } else if (lessons) {
            const filtered = lessons.filter(lesson => 
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

    const content = lessons?.map((lesson) => (
        <div className="my-4" key={`lesson-${lesson.id}`} onClick={() => router.push(`/platform/dashboard/admin/lessons/lessonData?scheduleID=${lesson.schedule_id}&studentID=${lesson.student_id}&day=${new Date(lesson.date).getDay()}`)}>
            <LessonElement lesson={lesson}/>
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
                <div key={`lesson-${lesson.id}`} onClick={() => router.push(`/platform/dashboard/admin/lessons/lessonData?scheduleID=${lesson.schedule_id}&studentID=${lesson.student_id}&day=${new Date(lesson.date).getDay()}`)}>
                    <LessonElement lesson={lesson}/>
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
        />
    )


    if (loading) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('lessons.loading_lessons')}</p></DashboardPage>
    if (error) return <DashboardPage title={title}><p className="text-red-500 text-xl">{error}</p></DashboardPage>
    if (!lessons || lessons.length === 0) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('common.no_data_found')}</p></DashboardPage>

    const actionStatusBanner = (createState?.message) ? (
        <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            createState?.message === 'queued'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : createState?.message === 'fail'
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
        }`}>
            {createState?.message === 'queued'
                ? t('lessons.offline_sync')
                : createState?.message === 'fail'
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
                fieldInput={fieldInput}
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
                        <div key={`lesson-${lesson.id}`}>
                            <LessonElement lesson={lesson}/>
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