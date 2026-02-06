'use client'

import React, { useActionState } from "react";
import * as openApi from "../../../lib/openApi"
import { createLesson, listLessons } from "@/app/actions/dashboard";
import dashboardPage from "../page";
import { DataTable } from "./data_table";
import { columns, HWcolumns } from "./columns";
import { dummyLessons } from "@/lib/dummyData";
import * as Icon from "@deemlol/next-icons"
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function Lessons() {
    const [lessons, setLessons] = React.useState<openApi.LessonRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [createState, createAction, createPending] = useActionState(createLesson, undefined)

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

    const lessonElement = (lesson: openApi.LessonRead) => (
        <div className="overflow-hidden border-2 rounded-xl bg-white flex flex-col justify-start p-4 shadow-[0px_4px_30px_rgba(0,0,0,0.1)] opacity-90 backdrop-blur-sm hover:opacity-80 transition duration-300 hover:scale-101">
            <div className='flex flex-col justify-center items-start mb-4'>
                <p id="name" className="text-3xl text-slate-800">ID: {lesson.id}</p>
                <div className="grid grid-cols-2">
                    <p className="text-xl text-slate-600 flex items-center col-start-1 col-end-2"><Icon.Calendar className="inline pr-1"/>: {lesson.date}</p>
                    <p className="text-xl text-slate-600 flex items-center col-start-2 col-end-3"><Icon.Clock className="inline pr-1"/> Attendance: {lesson.attendance}</p>
                </div>
            </div>
            <div className="mb-2">
                <p className="text-lg text-slate-600 pb-0.5">Recited</p>
                <DataTable columns={columns} data={[lesson]} />
            </div>
            <div className="mb-2">
                <p className="text-lg text-slate-600 pb-0.5">New Memorization</p>
                <DataTable columns={HWcolumns} data={[lesson]} />
            </div>
            {lesson.absence_reason && <p className="w-full text-[12px] text-slate-600"><span className="font-bold text-slate-800">Absence Reason</span> "{lesson.absence_reason}"</p>}
            {lesson.sheikh_notes && <p className="w-full text-[12px] text-slate-600"><span className="font-bold text-slate-800">Sheikh Notes</span> "{lesson.sheikh_notes}"</p>}
            {lesson.student_notes && <p className="w-full text-[12px] text-slate-600"><span className="font-bold text-slate-800">Student Notes</span> "{lesson.student_notes}"</p>}
        </div>
    )

    const fieldInput = (label: string, name: string, holder: string, type: string) => (
        <Field orientation="vertical" className='w-full'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder}></Input>
        </Field>
    )

    const titleElement = (title:string) => (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                    <div>
                        <Field orientation="horizontal" className='w-80'>
                            <Input id="student-id-search" name="student-id-search" type="search" placeholder="Enter student id..." className='border-slate-950'/>
                            <Button>Search</Button>
                        </Field>
                    </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">Create Lesson</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Lesson</AlertDialogTitle>
                            <form action={createAction}>
                                <div className="flex flex-col gap-4">
                                    {fieldInput("Student ID","student-id", "Enter student id...", "number")}
                                    {createState?.error?.student_id && <p className="text-red-500 text-sm">{createState.error.student_id}</p>}
                                    {fieldInput("Schedule ID", "schedule-id", "Enter schedule id...", "number")}
                                    {createState?.error?.schedule_id && <p className="text-red-500 text-sm">{createState.error.schedule_id}</p>}
                                    <div className="grid grid-cols-3 gap-4">
                                        {fieldInput("Date", "date", "Select date...", "date")}
                                        {createState?.error?.date && <p className="text-red-500 text-sm">{createState.error.date}</p>}
                                        <div className="flex flex-col gap-1.5">
                                        <label htmlFor="lesson-type" className="text-sm font-medium">Type</label>
                                            <Select>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                    <SelectLabel>Type</SelectLabel>
                                                    <SelectItem value={openApi.LessonType.Evaluation} defaultChecked>Evaluation</SelectItem>
                                                    <SelectItem value={openApi.LessonType.NewMemorization}>New Memorization</SelectItem>
                                                    <SelectItem value={openApi.LessonType.Revision}>Revision</SelectItem>
                                                    <SelectItem value={openApi.LessonType.Makeup}>Makeup</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createState?.error?.type && <p className="text-red-500 text-sm">{createState.error.type}</p>}
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="lesson-attendance" className="text-sm font-medium">Attendance</label>
                                            <Select>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Attendance" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                    <SelectLabel>Attendance</SelectLabel>
                                                    <SelectItem value={openApi.AttendanceStatus.Present} defaultChecked>Present</SelectItem>
                                                    <SelectItem value={openApi.AttendanceStatus.Absent}>Absent</SelectItem>
                                                    <SelectItem value={openApi.AttendanceStatus.Excused}>Excused</SelectItem>
                                                    <SelectItem value={openApi.AttendanceStatus.Late}>Late</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createState?.error?.attendance && <p className="text-red-500 text-sm">{createState.error.attendance}</p>}
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        {fieldInput("Juz","juz", "juz", "number")}
                                        {createState?.error?.juz && <p className="text-red-500 text-sm">{createState.error.juz}</p>}
                                        {fieldInput("Surah", "surah", "surah", "text")}
                                        {createState?.error?.surah && <p className="text-red-500 text-sm">{createState.error.surah}</p>}
                                        {fieldInput("Ayah from", "ayah-from", "ayah from", "number")}
                                        {createState?.error?.ayah_from && <p className="text-red-500 text-sm">{createState.error.ayah_from}</p>}
                                        {fieldInput("To", "ayah-to", "to", "number")}
                                        {createState?.error?.ayah_to && <p className="text-red-500 text-sm">{createState.error.ayah_to}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="lesson-quality" className="text-sm font-medium">Quality</label>
                                            <Select>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Quality" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                    <SelectLabel>Quality</SelectLabel>
                                                    <SelectItem value={openApi.LessonQuality.Excellent} defaultChecked>Excellent</SelectItem>
                                                    <SelectItem value={openApi.LessonQuality.VeryGood}>Very Good</SelectItem>
                                                    <SelectItem value={openApi.LessonQuality.Good}>Good</SelectItem>
                                                    <SelectItem value={openApi.LessonQuality.Fair}>Fair</SelectItem>
                                                    <SelectItem value={openApi.LessonQuality.NeedsImprovement}>Needs Improvement</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createState?.error?.quality && <p className="text-red-500 text-sm">{createState.error.quality}</p>}
                                        {fieldInput("Attempts", "attempts", "attempts", "number")}
                                        {createState?.error?.attempts && <p className="text-red-500 text-sm">{createState.error.attempts}</p>}
                                    </div>
                                    {fieldInput("Absence Reason", "absence-reason", "Enter reason for absence...", "text")}
                                    {createState?.error?.absence_reason && <p className="text-red-500 text-sm">{createState.error.absence_reason}</p>}
                                    {fieldInput("Sheikh Notes", "sheikh-notes", "Enter sheikh notes...", "text")}
                                    {createState?.error?.sheikh_notes && <p className="text-red-500 text-sm">{createState.error.sheikh_notes}</p>}
                                    {fieldInput("Student Notes", "student-notes", "Enter student notes...", "text")}
                                    {createState?.error?.student_notes && <p className="text-red-500 text-sm">{createState.error.student_notes}</p>}
                                </div>
                            </form>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel type="reset" disabled={createPending}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={createPending}>{createPending ? 'Creating...' : 'Create'}</Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button className="transition duration-300 col-start-2 col-end-3 cursor-pointer bg-slate-400 hover:bg-slate-600">Update Lesson</Button>
                    <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">Get Lesson</Button>
                </div>
            </div>
    )

    // if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading lessons...</p>, title: "Lessons"})
    // if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: "Lessons"})
    // if (!lessons || lessons.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No lessons found.</p>, title: "Lessons"})

    const content = dummyLessons?.map((lesson) => (
        <div key={lesson.id}>
            {lessonElement(lesson)}
        </div>
    ))

    return dashboardPage({children: content, title: titleElement("Lessons")})
}