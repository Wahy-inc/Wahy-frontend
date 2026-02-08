'use client'

import React, { useActionState } from "react";
import * as openApi from "@/lib/openApi"
import { createLesson, getLessonByID, listLessons, updateLesson } from "@/app/platform/actions/dashboard";
import dashboardPage from "../page";
import { dummyLessons } from "@/lib/dummyData";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateLessonFormState } from "@/app/platform/lib/definitions";
import lessonElement from "./lesson_element";
import titleElement from "./title_element";


export default function Lessons() {
    const [lessons, setLessons] = React.useState<openApi.LessonRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [createState, createAction, createPending] = useActionState(createLesson, undefined)
    const updateLessonAction = (state: UpdateLessonFormState, formData: FormData) => updateLesson(state, formData, Number(formData.get('lesson-id')))
    const [updateState, updateAction, updatePending] = useActionState(updateLessonAction, undefined)
    const [getLessonState, getLessonAction, getLessonPending] = useActionState(getLessonByID, undefined)
    const [fetchedLesson, setFetchedLesson] = React.useState<openApi.LessonRead | null>(null)
    const [getLessonDialogOpen, setGetLessonDialogOpen] = React.useState(false)
    const [createLessonDialogOpen, setCreateLessonDialogOpen] = React.useState(false)
    const [updateLessonDialogOpen, setUpdateLessonDialogOpen] = React.useState(false)
    const [searchStudentId, setSearchStudentId] = React.useState<string>("")
    const [filteredLessons, setFilteredLessons] = React.useState<openApi.LessonRead[] | null>(null)

    React.useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true)
                const data = await listLessons()
                setLessons(data)
                setError(null)
            } catch (err) {
                setError('Failed to load Lessons')
                setLessons(null)
            } finally {
                setLoading(false)
            }
        }
        fetchLessons()
    }, [])

    React.useEffect(() => {
        if (getLessonState?.message == 'success' && getLessonState.data) {
            setFetchedLesson(getLessonState.data)
        }
    }, [getLessonState])

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
        <div key={lesson.id}>
            {lessonElement({lesson, updateAction, updateState, updatePending, setUpdateLessonDialogOpen, updateLessonDialogOpen, fieldInput})}
        </div>
    ))

    let displayContent = content
    let displayTitle = "Lessons"

    if (searchStudentId && filteredLessons) {
        if (filteredLessons.length === 0) {
            displayContent = [<p key="no-lessons" className="text-slate-700 text-xl">No lessons found for student ID: {searchStudentId}</p>]
            displayTitle = `Lessons - Student ${searchStudentId}`
        } else {
            displayContent = filteredLessons.map((lesson) => (
                <div key={lesson.id}>
                    {lessonElement({lesson, updateAction, updateState, updatePending, setUpdateLessonDialogOpen, updateLessonDialogOpen, fieldInput})}
                </div>
            ))
            displayTitle = `Lessons - Student ${searchStudentId} (${filteredLessons.length})`
        }
    }

    const title = titleElement({
            title: displayTitle,
            handleSearchStudentId: handleSearchStudentId,
            searchStudentId: searchStudentId,
            handleClearFilter: handleClearFilter,
            getLessonState: getLessonState,
            getLessonAction: getLessonAction,
            getLessonPending: getLessonPending,
            createState: createState,
            createAction: createAction,
            createPending: createPending,
            fieldInput: fieldInput,
            createLessonDialogOpen: createLessonDialogOpen,
            setCreateLessonDialogOpen: setCreateLessonDialogOpen,
            getLessonDialogOpen: getLessonDialogOpen,
            setGetLessonDialogOpen: setGetLessonDialogOpen,
        })


    if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading lessons...</p>, title: title})
    if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: title})
    if (!lessons || lessons.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No lessons found.</p>, title: title})

    if (fetchedLesson && getLessonState?.message == 'success') {
        return dashboardPage({children: [
            <div key="clear-filter" className='flex flex-row justify-end'>
                <Button variant="outline" className='transition duration-300 mx-10 mt-4 mb-2 border border-red-500 rounded-xl text-red-500 bg-slate-100 cursor-pointer hover:bg-red-500 hover:text-slate-100' onClick={() => {setFetchedLesson(null)}}>Clear Filter</Button>
            </div>
            ,<div key={fetchedLesson.id}>{lessonElement({lesson: fetchedLesson, updateAction, updateState, updatePending, setUpdateLessonDialogOpen, updateLessonDialogOpen, fieldInput})}</div>], title: titleElement({
                title: `Lesson Details - ID ${fetchedLesson.id}`,
                createAction: createAction,
                createState: createState,
                createPending: createPending,
                setCreateLessonDialogOpen: setCreateLessonDialogOpen,
                createLessonDialogOpen: createLessonDialogOpen,
                fieldInput: fieldInput,
                getLessonDialogOpen: getLessonDialogOpen,
                setGetLessonDialogOpen: setGetLessonDialogOpen,
                handleSearchStudentId: handleSearchStudentId,
                searchStudentId: searchStudentId,
                handleClearFilter: handleClearFilter,
                getLessonState: getLessonState,
                getLessonAction: getLessonAction,
                getLessonPending: getLessonPending
            })})
    } else {
        return dashboardPage({children: displayContent, title: title})
    }

}