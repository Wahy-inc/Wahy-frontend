import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as openApi from "@/lib/openApi";
import { JSX } from "react";
import { CreateLessonFormState, GetLessonByIDFormState } from "../../lib/definitions";

export default function titleElement({
    title,
    handleClearFilter,
    handleSearchStudentId,
    searchStudentId,
    createAction,
    createPending,
    createState,
    getLessonAction,
    getLessonPending,
    getLessonState,
    fieldInput,
    createLessonDialogOpen,
    setCreateLessonDialogOpen,
    getLessonDialogOpen,
    setGetLessonDialogOpen,
    isAdmin
}: {
        title: string,
        handleSearchStudentId: (e: React.ChangeEvent<HTMLInputElement>) => void,
        searchStudentId: string,
        handleClearFilter: () => void,
        getLessonState: GetLessonByIDFormState,
        getLessonAction: (formData: FormData) => void,
        getLessonPending: boolean,
        createState: CreateLessonFormState,
        createAction: (formData: FormData) => void,
        createPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        createLessonDialogOpen: boolean,
        setCreateLessonDialogOpen: (open: boolean) => void,
        getLessonDialogOpen: boolean,
        setGetLessonDialogOpen: (open: boolean) => void,
        isAdmin: boolean
    }) {
    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <Field orientation="horizontal" className='w-80'>
                            <Input onChange={handleSearchStudentId} id="student-id-search" name="student-id-search" type="search" placeholder="Enter student id..." className='border-slate-950'/>
                            <div className="bg-slate-950 text-slate-100 border-slate-950 px-2 py-2 rounded-xl text-sm">{searchStudentId ? 'Filtered' : 'Search'}</div>
                        </Field>
                        {searchStudentId && (
                            <Button 
                                onClick={handleClearFilter}
                                variant="outline" 
                                className='transition duration-300 border border-red-500 rounded-xl text-red-500 bg-slate-100 hover:bg-red-500 hover:text-slate-100 cursor-pointer'
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    {isAdmin ?
                    <div>
                    <AlertDialog open={createLessonDialogOpen} onOpenChange={createState?.message == 'success'? () => setCreateLessonDialogOpen(false) : setCreateLessonDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">Create Lesson</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={createAction}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Lesson</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                    <div className='flex flex-col'>
                                        {fieldInput("Student ID","student-id", "Enter student id...", "number")}
                                        {createState?.error?.student_id && <p className="text-red-500 text-sm">{createState.error.student_id}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                    {fieldInput("Schedule ID", "schedule-id", "Enter schedule id...", "number")}
                                    {createState?.error?.schedule_id && <p className="text-red-500 text-sm">{createState.error.schedule_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Date", "date", "Select date...", "date")}
                                            {createState?.error?.date && <p className="text-red-500 text-sm">{createState.error.date}</p>}
                                        </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="type" className="text-sm font-medium">Type</label>
                                            <Select name="type">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select a type" />
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
                                        {createState?.error?.type && <p className="text-red-500 text-sm">{createState.error.type}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="attendance" className="text-sm font-medium">Attendance</label>
                                            <Select name="attendance">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Attendance" />
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
                                        {createState?.error?.attendance && <p className="text-red-500 text-sm">{createState.error.attendance}</p>}
                                    </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Juz","juz", "juz", "number")}
                                            {createState?.error?.juz && <p className="text-red-500 text-sm">{createState.error.juz}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Surah", "surah", "surah", "text")}
                                            {createState?.error?.surah && <p className="text-red-500 text-sm">{createState.error.surah}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Ayah from", "ayah-from", "ayah from", "number")}
                                            {createState?.error?.ayah_from && <p className="text-red-500 text-sm">{createState.error.ayah_from}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("To", "ayah-to", "to", "number")}
                                            {createState?.error?.ayah_to && <p className="text-red-500 text-sm">{createState.error.ayah_to}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="quality" className="text-sm font-medium">Quality</label>
                                            <Select name="quality">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Quality" />
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
                                        {createState?.error?.quality && <p className="text-red-500 text-sm">{createState.error.quality}</p>}
                                    </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Attempts", "attempts", "attempts", "number")}
                                            {createState?.error?.attempts && <p className="text-red-500 text-sm">{createState.error.attempts}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Absence Reason", "absence-reason", "Enter reason for absence...", "text")}
                                        {createState?.error?.absence_reason && <p className="text-red-500 text-sm">{createState.error.absence_reason}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Sheikh Notes", "sheikh-notes", "Enter sheikh notes...", "text")}
                                        {createState?.error?.sheikh_notes && <p className="text-red-500 text-sm">{createState.error.sheikh_notes}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Student Notes", "student-notes", "Enter student notes...", "text")}
                                        {createState?.error?.student_notes && <p className="text-red-500 text-sm">{createState.error.student_notes}</p>}
                                    </div>
                                    {createState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to create lesson. Please check the data and try again.</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={createPending}>Cancel</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? 'Creating...' : 'Create'}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div> : <div></div>}
                    <AlertDialog open={getLessonDialogOpen} onOpenChange={getLessonState?.message == 'success'? () => setGetLessonDialogOpen(false) : setGetLessonDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">Get Lesson</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={getLessonAction}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Get lesson using ID</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the ID of the lesson you want to retrieve. Make sure to enter a valid lesson ID to get the correct information.
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput("Lesson ID", "lesson-id", "Enter lesson ID...", "number")}
                            {getLessonState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to fetch lesson. Please check the ID and try again.</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getLessonPending}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={getLessonPending}>{getLessonPending? 'Loading...' : 'Get'}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}