'use client'

import React, { useActionState } from "react";
import * as openApi from "@/lib/openApi"
import { getLessonByDayMe, listLessonsMe } from "@/app/platform/actions/dashboard";
import DashboardPage from "../page";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LessonElement from "./lesson_element";
import TitleElement from "./title_element";
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";
import { useRouter } from "next/navigation";


export default function Lessons() {
    const { isLoading: authLoading } = useAuth()
    const { t } = useLocalization()
    const [lessons, setLessons] = React.useState<openApi.ClassGroupItem[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [getLessonState, getLessonFormAction, getLessonPending] = useActionState(getLessonByDayMe, undefined)
    const [fetchedLessons, setFetchedLessons] = React.useState<openApi.ClassGroupItem[] | null>(null)
    const router = useRouter()

    useToastListener(getLessonState, {functionName: "Get Lesson", successMessage: t('lessons.get_success'), errorMessage: t('lessons.get_error')})
    
    React.useEffect(() => {
        if (authLoading) return

        const cachedLessons = getCachedData<openApi.ClassGroupItem[]>(
            offlineCacheKeys.lessonsListMe,
        )
        if (cachedLessons && cachedLessons.length > 0) {
            setLessons(cachedLessons)
            setLoading(false)
        }
        
        const fetchLessons = async () => {
            try {
                setLoading(true)
                const data = await listLessonsMe()
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
       
    }, [getLessonState, t])

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const content = Array.isArray(lessons) ? lessons.map((lesson) => (
        <div key={`lesson-${lesson.schedule_id}-${lesson.student_id}`} className="cursor-pointer my-3" onClick={() => router.push(`/platform/dashboard/student/lessons/lessonData?scheduleID=${lesson.schedule_id}`)} >
            <LessonElement lesson={lesson} />
        </div>
    )) : []

    const displayContent = content
    const displayTitle = t('lessons.title')

    const title = (
        <TitleElement
            title={displayTitle}
            getLessonState={getLessonState}
            getLessonAction={getLessonFormAction}
            getLessonPending={getLessonPending}
            fieldInput={fieldInput}
        />
    )


    if (loading) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('lessons.loading_lessons')}</p></DashboardPage>
    if (error) return <DashboardPage title={title}><p className="text-red-500 text-xl">{error}</p></DashboardPage>
    if (!lessons || lessons.length === 0) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('common.no_data_found')}</p></DashboardPage>

    if (fetchedLessons && getLessonState?.message == 'success') {
        return <DashboardPage title={(
            <TitleElement
                title={`${t('lessons.lesson_details')} ${fetchedLessons?.length? `(${fetchedLessons.length})` : ''}`}
                fieldInput={fieldInput}
                getLessonState={getLessonState}
                getLessonAction={getLessonFormAction}
                getLessonPending={getLessonPending}
            />
        )}>
            <div className='flex flex-row justify-end'>
                <Button variant="outline" className='transition duration-300 mx-10 mt-4 mb-2 border border-red-500 rounded-xl text-red-500 bg-slate-100 cursor-pointer hover:bg-red-500 hover:text-slate-100' onClick={() => {setFetchedLessons([])}}>{t('common.clear')}</Button>
            </div>
            <div>
                {fetchedLessons?.length === 0 ? (
                    <p className="text-slate-700 text-xl">{t('lessons.no_lessons_found')}</p>
                ) : (
                    Array.isArray(fetchedLessons) && fetchedLessons.map((lesson) => (
                        <div className="my-3" key={`lesson-${lesson.student_id}-${lesson.schedule_id}`} onClick={() => router.push(`/platform/dashboard/admin/lessons/lessonData?scheduleID=${lesson.schedule_id}`)}>
                            <LessonElement lesson={lesson}/>
                        </div>
                    ))
                )}
            </div>
        </DashboardPage>
    } else {
        return <DashboardPage title={title}>
            <div>{displayContent}</div>
        </DashboardPage>
    }
}