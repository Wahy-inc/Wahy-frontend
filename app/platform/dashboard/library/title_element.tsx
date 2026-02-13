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
import { JSX, useState } from "react";
import * as openApi from "../../../../lib/openApi"
import { CreateLibraryItemFormState, GetLibraryItemByIDFormState } from "@/app/platform/lib/definitions";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";

export default function TitleElement({
    title,
    createAction,
    createPending,
    createState,
    getLibraryAction,
    getLibraryPending,
    getLibraryState,
    fieldInput,
    createLibraryDialogOpen,
    setcreateLibraryDialogOpen,
    getLibraryDialogOpen,
    setgetLibraryDialogOpen,
    isAdmin,
    disableCreate
}: {
        title: string,
        getLibraryState: GetLibraryItemByIDFormState,
        getLibraryAction: (formData: FormData) => void,
        getLibraryPending: boolean,
        createState: CreateLibraryItemFormState,
        createAction: (formData: FormData) => void,
        createPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        createLibraryDialogOpen: boolean,
        setcreateLibraryDialogOpen: (open: boolean) => void,
        getLibraryDialogOpen: boolean,
        setgetLibraryDialogOpen: (open: boolean) => void,
        isAdmin: boolean,
        disableCreate?: boolean
    }) {
    // Track if forms have been submitted in current dialog session
    const [createFormSubmitted, setCreateFormSubmitted] = useState(false)
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)

    const handleCreateDialogOpenChange = (open: boolean) => {
        if (!open) {
            setCreateFormSubmitted(false)
        }
        if (createState?.message === 'success') {
            setcreateLibraryDialogOpen(false)
        } else {
            setcreateLibraryDialogOpen(open)
        }
    }

    const handleGetDialogOpenChange = (open: boolean) => {
        if (!open) {
            setGetFormSubmitted(false)
        }
        if (getLibraryState?.message === 'success') {
            setgetLibraryDialogOpen(false)
        } else {
            setgetLibraryDialogOpen(open)
        }
    }

    const handleCreateSubmit = (formData: FormData) => {
        setCreateFormSubmitted(true)
        createAction(formData)
    }

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getLibraryAction(formData)
    }

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    {isAdmin ? 
                    <div>
                    <AlertDialog open={createLibraryDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
                        <AlertDialogTrigger asChild>
                            <Button disabled={disableCreate} className="transition duration-300 col-start-1 col-end-2 cursor-pointer">Create Library Item</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleCreateSubmit}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Library Item</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                    <div className='flex flex-col'>
                                        {fieldInput("Title","title", "", "text")}
                                        {createFormSubmitted && createState?.error?.title && <p className="text-red-500 text-sm">{createState.error.title}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Description","description", "", "text")}
                                        {createFormSubmitted && createState?.error?.description && <p className="text-red-500 text-sm">{createState.error.description}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("URL","url", "", "text")}
                                        {createFormSubmitted && createState?.error?.url && <p className="text-red-500 text-sm">{createState.error.url}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Category","category", "", "text")}
                                            {createFormSubmitted && createState?.error?.category && <p className="text-red-500 text-sm">{createState.error.category}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Tags", "tags", "separated by commas", "text")}
                                            {createFormSubmitted && createState?.error?.tags && <p className="text-red-500 text-sm">{createState.error.tags}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="access_level" className="text-sm font-medium">Access</label>
                                            <Select name="access_level">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Select Access Level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Access Level</SelectLabel>
                                                        <SelectItem value={openApi.LibraryAccessLevel.AllStudents}>All Students</SelectItem>
                                                        <SelectItem value={openApi.LibraryAccessLevel.Groups}>Groups</SelectItem>
                                                        <SelectItem value={openApi.LibraryAccessLevel.SpecificStudents}>Specific Students</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createFormSubmitted && createState?.error?.access_level && <p className="text-red-500 text-sm">{createState.error.access_level}</p>}
                                    </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Thumbnail URL", "thumbnail", "Enter thumbnail URL...", "text")}
                                            {createFormSubmitted && createState?.error?.thumbnail && <p className="text-red-500 text-sm">{createState.error.thumbnail}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Student ID", "students_ids", "", "text")}
                                        {createFormSubmitted && createState?.error?.student_ids && <p className="text-red-500 text-sm">{createState.error.student_ids}</p>}
                                    </div>
                                    {createFormSubmitted && createState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to create schedule. Please check the data and try again.</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={createPending}>Cancel</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? 'Creating...' : 'Create'}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    {disableCreate ? <p className="text-amber-700 text-xs mt-2">Library create/upload is online-only.</p> : null}
                    </div> : <div></div>}
                    <AlertDialog open={getLibraryDialogOpen} onOpenChange={handleGetDialogOpenChange}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">Get Library Item</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Get Library Item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the ID of the Item you want to retrieve. Make sure to enter a valid ID to get the correct information.
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput("Item ID", "item-id", "Enter item ID...", "number")}
                            {getFormSubmitted && getLibraryState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to fetch item. Please check the ID and try again.</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getLibraryPending}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={getLibraryPending}>{getLibraryPending? 'Loading...' : 'Get'}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}