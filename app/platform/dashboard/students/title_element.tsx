import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { JSX } from "react";
import { CreateLibraryItemFormState, CreateStudentFormState, GetLibraryItemByIDFormState, GetStudentFormState } from "@/app/platform/lib/definitions";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function titleElement({
    title,
    createAction,
    createPending,
    createState,
    getStudentAction,
    getStudentPending,
    getStudentState,
    fieldInput,
    createStudentDialogOpen,
    setcreateStudentDialogOpen,
    getStudentDialogOpen,
    setgetStudentDialogOpen,
}: {
        title: string,
        getStudentState: GetStudentFormState,
        getStudentAction: (formData: FormData) => void,
        getStudentPending: boolean,
        createState: CreateStudentFormState,
        createAction: (formData: FormData) => void,
        createPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        createStudentDialogOpen: boolean,
        setcreateStudentDialogOpen: (open: boolean) => void,
        getStudentDialogOpen: boolean,
        setgetStudentDialogOpen: (open: boolean) => void
    }) {
    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <AlertDialog open={createStudentDialogOpen} onOpenChange={createState?.message == 'success'? () => setcreateStudentDialogOpen(false) : setcreateStudentDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">Create Student</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={createAction} id={`create-student-form-${Date.now()}`}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Student</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                <div className="flex flex-col">
                                    {fieldInput("Student ID","id", "", "number")}
                                    {createState?.error?.id && <p className="text-red-500 text-sm">{createState.error.id}</p>}
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput("Name in Arabic","ar-name", "", "text")}
                                        {createState?.error?.arname && <p className="text-red-500 text-sm">{createState.error.arname}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Name in English","en-name", "", "text")}
                                        {createState?.error?.enname && <p className="text-red-500 text-sm">{createState.error.enname}</p>}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput("Phone","phone", "", "text")}
                                    {createState?.error?.phone && <p className="text-red-500 text-sm">{createState.error.phone}</p>}
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput("Date of Birth","date-of-birth", "", "date")}
                                        {createState?.error?.dateOfBirth && <p className="text-red-500 text-sm">{createState.error.dateOfBirth}</p>}
                                    </div>
                                <div className='flex flex-col'>
                                    {fieldInput("Timezone","timezone", "", "text")}
                                    {createState?.error?.timeZone && <p className="text-red-500 text-sm">{createState.error.timeZone}</p>}
                                </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3">
                                    <div className='flex flex-col'>
                                        {fieldInput("Current juz","current-juz", "", "number")}
                                        {createState?.error?.currjuz && <p className="text-red-500 text-sm">{createState.error.currjuz}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Current surah","current-surah", "", "text")}
                                        {createState?.error?.currsurah && <p className="text-red-500 text-sm">{createState.error.currsurah}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Current ayah","current-ayah", "", "number")}
                                        {createState?.error?.currayah && <p className="text-red-500 text-sm">{createState.error.currayah}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-row justify-between gap-3 items-center">
                                    <div className='flex flex-col'>
                                        {fieldInput("Lessons per week","lessons-per-week", "", "text")}
                                        {createState?.error?.lessonsPerWeek && <p className="text-red-500 text-sm">{createState.error.lessonsPerWeek}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Lessons rate","lessons-rate", "", "number")}
                                        {createState?.error?.lessonRate && <p className="text-red-500 text-sm">{createState.error.lessonRate}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Billing cycle","billing-cycle", "Enter your billing cycle (e.g., monthly, weekly)", "number")}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput("Private notes","private-notes", "", "text")}
                                    {createState?.error?.privateNotes && <p className="text-red-500 text-sm">{createState.error.privateNotes}</p>}
                                </div>
                                <div className='flex flex-col'>
                                    {fieldInput("Special notes","special-notes", "", "text")}
                                    {createState?.error?.specialNotes && <p className="text-red-500 text-sm">{createState.error.specialNotes}</p>}
                                </div>
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={createPending}>Cancel</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? 'Creating...' : 'Create'}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={getStudentDialogOpen} onOpenChange={getStudentState?.message == 'success'? () => setgetStudentDialogOpen(false) : setgetStudentDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">Get Student</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={getStudentAction}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Get Student</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the ID of the Student you want to retrieve. Make sure to enter a valid ID to get the correct information.
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput("Student ID", "student-id", "Enter student ID...", "number")}
                            {getStudentState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to fetch student. Please check the ID and try again.</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getStudentPending}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={getStudentPending}>{getStudentPending? 'Loading...' : 'Get'}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}