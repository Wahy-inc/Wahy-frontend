import * as openApi from "@/lib/openApi"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "./data_table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { columns, HWcolumns } from "./columns"
import * as Icon from '@deemlol/next-icons'
import { JSX } from "react"
import { UpdateLessonFormState } from "@/app/platform/lib/definitions"

const getQuality = (quality: string | null) => {
        switch (quality) {
            case 'excellent':
                return openApi.LessonQuality.Excellent
            case 'very_good':
                return openApi.LessonQuality.VeryGood
            case 'good':
                return openApi.LessonQuality.Good
            case 'fair':
                return openApi.LessonQuality.Fair
            case 'needs_improvement':
                return openApi.LessonQuality.NeedsImprovement
            case null:
                return 'Not Evaluated'
        }
}

export default function lessonElement({lesson, updateAction, updateState, updatePending, setUpdateLessonDialogOpen, updateLessonDialogOpen, fieldInput}: {lesson: openApi.LessonRead, updateAction: (formData: FormData) => void, updateState: UpdateLessonFormState | null | undefined, updatePending: boolean, setUpdateLessonDialogOpen: (open: boolean) => void, updateLessonDialogOpen: boolean, fieldInput: (label: string, name: string, defaultValue: string, type: string) => JSX.Element}) {
    return (
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
            {lesson.absence_reason && <p className="w-full text-[12px] text-slate-600"><span className="font-bold text-slate-800">Absence Reason</span> &quot;{lesson.absence_reason}&quot;</p>}
            {lesson.sheikh_notes && <p className="w-full text-[12px] text-slate-600"><span className="font-bold text-slate-800">Sheikh Notes</span> &quot;{lesson.sheikh_notes}&quot;</p>}
            {lesson.student_notes && <p className="w-full text-[12px] text-slate-600"><span className="font-bold text-slate-800">Student Notes</span> &quot;{lesson.student_notes}&quot;</p>}
            <div className="flex flex-row justify-end">
                    <AlertDialog open={updateLessonDialogOpen} onOpenChange={updateState?.message == 'success'? () => setUpdateLessonDialogOpen(false) : setUpdateLessonDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 mt-4 cursor-pointer bg-slate-400 hover:bg-slate-600">Update Lesson</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={updateAction} className="w-full">
                            <AlertDialogHeader>
                            <AlertDialogTitle>Update Lesson</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                    <input type="hidden" name="lesson-id" value={lesson.id} />
                                    <div className='flex flex-col'>
                                        {fieldInput("Schedule ID", "schedule-id", String(lesson.schedule_id), "number")}
                                        {updateState?.error?.schedule_id && <p className="text-red-500 text-sm">{updateState.error.schedule_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Date", "date", String(lesson.date), "date")}
                                            {updateState?.error?.date && <p className="text-red-500 text-sm">{updateState.error.date}</p>}
                                        </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="type" className="text-sm font-medium">Type</label>
                                            <Select defaultValue={lesson.type} name="type">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Type</SelectLabel>
                                                        <SelectItem value={openApi.LessonType.Evaluation}>Evaluation</SelectItem>
                                                        <SelectItem value={openApi.LessonType.NewMemorization}>New Memorization</SelectItem>
                                                        <SelectItem value={openApi.LessonType.Revision}>Revision</SelectItem>
                                                        <SelectItem value={openApi.LessonType.Makeup}>Makeup</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateState?.error?.type && <p className="text-red-500 text-sm">{updateState.error.type}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="attendance" className="text-sm font-medium">Attendance</label>
                                            <Select defaultValue={lesson.attendance} name="attendance">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Attendance</SelectLabel>
                                                        <SelectItem value={openApi.AttendanceStatus.Present}>Present</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Absent}>Absent</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Excused}>Excused</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Late}>Late</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateState?.error?.attendance && <p className="text-red-500 text-sm">{updateState.error.attendance}</p>}
                                    </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Juz","juz", String(lesson.juz_number), "number")}
                                            {updateState?.error?.juz && <p className="text-red-500 text-sm">{updateState.error.juz}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Surah", "surah", String(lesson.surah_name), "text")}
                                            {updateState?.error?.surah && <p className="text-red-500 text-sm">{updateState.error.surah}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Ayah from", "ayah-from", String(lesson.ayah_from), "number")}
                                            {updateState?.error?.ayah_from && <p className="text-red-500 text-sm">{updateState.error.ayah_from}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("To", "ayah-to", String(lesson.ayah_to), "number")}
                                            {updateState?.error?.ayah_to && <p className="text-red-500 text-sm">{updateState.error.ayah_to}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="quality" className="text-sm font-medium">Quality</label>
                                            <Select defaultValue={getQuality(lesson.quality)} name="quality">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Quality</SelectLabel>
                                                        <SelectItem value={openApi.LessonQuality.Excellent}>Excellent</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.VeryGood}>Very Good</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.Good}>Good</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.Fair}>Fair</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.NeedsImprovement}>Needs Improvement</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateState?.error?.quality && <p className="text-red-500 text-sm">{updateState.error.quality}</p>}
                                    </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Attempts", "attempts", String(lesson.attempts), "number")}
                                            {updateState?.error?.attempts && <p className="text-red-500 text-sm">{updateState.error.attempts}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Absence Reason", "absence-reason", String(lesson.absence_reason), "text")}
                                        {updateState?.error?.absence_reason && <p className="text-red-500 text-sm">{updateState.error.absence_reason}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Sheikh Notes", "sheikh-notes", String(lesson.sheikh_notes), "text")}
                                        {updateState?.error?.sheikh_notes && <p className="text-red-500 text-sm">{updateState.error.sheikh_notes}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Student Notes", "student-notes", String(lesson.student_notes), "text")}
                                        {updateState?.error?.student_notes && <p className="text-red-500 text-sm">{updateState.error.student_notes}</p>}
                                    </div>
                                    {updateState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to update lesson. Please check the data and try again.</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={updatePending}>Cancel</AlertDialogCancel>
                                <Button type="submit" disabled={updatePending}>{updatePending ? 'Updating...' : 'Update'}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
            </div>
        </div>
    )
}
