'use client'

import React, { useActionState } from "react";
import * as openApi from "@/lib/openApi"
import { getLessonByIDMe, listLessonsMe } from "@/app/platform/actions/dashboard";
import dashboardPage from "../../admin/page";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GetLessonByIDFormState } from "@/app/platform/lib/definitions";
import LessonElement from "./lesson_element";
import TitleElement from "./title_element";
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";


export default function Lessons() {
    const { isLoading: authLoading } = useAuth()
    const { t } = useLocalization()
    const [lessons, setLessons] = React.useState<openApi.LessonRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const getLessonAction = async (state: GetLessonByIDFormState, formData: FormData) => {
        return getLessonByIDMe(state, formData)
    }
    const [getLessonState, getLessonFormAction, getLessonPending] = useActionState(getLessonAction, undefined)
    const [fetchedLesson, setFetchedLesson] = React.useState<openApi.LessonRead | null>(null)
    const [getLessonDialogOpen, setGetLessonDialogOpen] = React.useState(false)

    useToastListener(getLessonState, {functionName: "Get Lesson", successMessage: t('lessons.get_success'), errorMessage: t('lessons.get_error')})
    
    React.useEffect(() => {
        if (authLoading) return

        const cachedLessons = getCachedData<openApi.LessonRead[]>(
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
            setFetchedLesson(getLessonState.data)
        }
       
    }, [getLessonState, t])

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const content = lessons?.map((lesson) => (
        <div key={lesson.id}>
            <LessonElement lesson={lesson} />
        </div>
    ))

    const displayContent = content
    const displayTitle = t('lessons.title')

    const title = (
        <TitleElement
            title={displayTitle}
            getLessonState={getLessonState}
            getLessonAction={getLessonFormAction}
            getLessonPending={getLessonPending}
            fieldInput={fieldInput}
            getLessonDialogOpen={getLessonDialogOpen}
            setGetLessonDialogOpen={setGetLessonDialogOpen}
        />
    )


    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">{t('lessons.loading_lessons')}</p>, title: title})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: title})
    if (!lessons || lessons.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">{t('common.no_data_found')}</p>, title: title})

    if (fetchedLesson && getLessonState?.message == 'success') {
        return dashboardPage({children: [
            <div key="clear-filter" className='flex flex-row justify-end'>
                <Button variant="outline" className='transition duration-300 mx-10 mt-4 mb-2 border border-red-500 rounded-xl text-red-500 bg-slate-100 cursor-pointer hover:bg-red-500 hover:text-slate-100' onClick={() => {setFetchedLesson(null)}}>{t('common.clear')}</Button>
            </div>
            ,<div key={fetchedLesson.id}><LessonElement lesson={fetchedLesson}/></div>], title: (
            <TitleElement
                title={`${t('lessons.lesson_details')} ${fetchedLesson.id}`}
                fieldInput={fieldInput}
                getLessonDialogOpen={getLessonDialogOpen}
                setGetLessonDialogOpen={setGetLessonDialogOpen}
                getLessonState={getLessonState}
                getLessonAction={getLessonFormAction}
                getLessonPending={getLessonPending}
            />
        )})
    } else {
        return dashboardPage({children: [
            <div key="content">{displayContent}</div>
        ], title: title})
    }

}