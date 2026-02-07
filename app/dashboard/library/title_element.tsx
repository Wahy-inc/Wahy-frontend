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
import { JSX } from "react";
import { CreateLibraryItemFormState, CreateScheduleFormState, GetLibraryItemByIDFormState, GetSchedualesForStudentFormState } from "@/app/lib/definitions";

enum weekDays {
    saturday = 0,
    sunday = 1,
    monday = 2,
    tuesday = 3,
    wednesday = 4,
    thursday = 5,
    friday = 6
}

export default function titleElement({
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
        setgetLibraryDialogOpen: (open: boolean) => void
    }) {
    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <AlertDialog open={createLibraryDialogOpen} onOpenChange={createState?.message == 'success'? () => setcreateLibraryDialogOpen(false) : setcreateLibraryDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">Create Library Item</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={createAction}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Library Item</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                    <div className='flex flex-col'>
                                        {fieldInput("Title","title", "Enter title...", "text")}
                                        {createState?.error?.title && <p className="text-red-500 text-sm">{createState.error.title}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Description","description", "Enter description...", "text")}
                                        {createState?.error?.description && <p className="text-red-500 text-sm">{createState.error.description}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("URL","url", "Enter URL...", "text")}
                                        {createState?.error?.url && <p className="text-red-500 text-sm">{createState.error.url}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Category","category", "Enter category...", "text")}
                                            {createState?.error?.category && <p className="text-red-500 text-sm">{createState.error.category}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Tags", "tags", "separated by commas", "text")}
                                            {createState?.error?.tags && <p className="text-red-500 text-sm">{createState.error.tags}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Access level","access_level", "access", "text")}
                                            {createState?.error?.access_level && <p className="text-red-500 text-sm">{createState.error.access_level}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Thumbnail URL", "thumbnail", "Enter thumbnail URL...", "text")}
                                            {createState?.error?.thumbnail && <p className="text-red-500 text-sm">{createState.error.thumbnail}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Students IDs", "students_ids", "separated by commas", "text")}
                                        {createState?.error?.student_ids && <p className="text-red-500 text-sm">{createState.error.student_ids}</p>}
                                    </div>
                                    {createState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to create schedule. Please check the data and try again.</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={createPending}>Cancel</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? 'Creating...' : 'Create'}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog open={getLibraryDialogOpen} onOpenChange={getLibraryState?.message == 'success'? () => setgetLibraryDialogOpen(false) : setgetLibraryDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">Get Library Item</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={getLibraryAction}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Get Library Item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the ID of the Item you want to retrieve. Make sure to enter a valid ID to get the correct information.
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput("Item ID", "item-id", "Enter item ID...", "number")}
                            {getLibraryState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to fetch item. Please check the ID and try again.</p> : null}
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