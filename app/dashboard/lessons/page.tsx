'use client'

import React from "react";
import * as openApi from "../../../lib/openApi"
import { listLessons } from "@/app/actions/dashboard";
import dashboardPage from "../page";
import { DataTable } from "./data_table";
import { columns, HWcolumns } from "./columns";
import { dummyLessons } from "@/lib/dummyData";
import * as Icon from "@deemlol/next-icons"

export default function Lessons() {
    const [lessons, setLessons] = React.useState<openApi.LessonRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

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

    // if (loading) return dashboardPage({children: <p className="text-slate-700 text-xl">Loading lessons...</p>, title: "Lessons"})
    // if (error) return dashboardPage({children: <p className="text-red-500 text-xl">{error}</p>, title: "Lessons"})
    // if (!lessons || lessons.length === 0) return dashboardPage({children: <p className="text-slate-700 text-xl">No lessons found.</p>, title: "Lessons"})

    const content = dummyLessons?.map((lesson) => (
        <div key={lesson.id}>
            {lessonElement(lesson)}
        </div>
    ))

    return dashboardPage({children: content, title: "Lessons"})
}