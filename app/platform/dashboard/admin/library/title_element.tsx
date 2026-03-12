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
import * as openApi from "../../../../../lib/openApi"
import { CreateLibraryItemFormState, GetLibraryItemByIDFormState } from "@/app/platform/lib/definitions";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { useLocalization } from "@/lib/localization-context";
import StudentMenu from "@/components/studentsMenu";

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
        disableCreate?: boolean
    }) {
    const { t } = useLocalization()
    // Track if forms have been submitted in current dialog session
    const [createFormSubmitted, setCreateFormSubmitted] = useState(false)
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

    const handleCreateSubmit = (formData: FormData) => {
        setCreateFormSubmitted(true)
        formData.append("student_ids", selectedStudentId?.toString() || "")
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
                    <div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={disableCreate} className="transition duration-300 col-start-1 col-end-2 cursor-pointer">{t('library.create_item')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleCreateSubmit}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('library.create_item')}</AlertDialogTitle>
                                <div className="flex flex-col gap-4 rtl:text-right">
                                    <div className='flex flex-col'>
                                        {fieldInput(t('library.item_title'),"title", "", "text")}
                                        {createFormSubmitted && createState?.error?.title && <p className="text-red-500 text-sm">{createState.error.title}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('library.description') + " (Optional)","description", "", "text")}
                                        {createFormSubmitted && createState?.error?.description && <p className="text-red-500 text-sm">{createState.error.description}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('library.url'),"url", "", "text")}
                                        {createFormSubmitted && createState?.error?.url && <p className="text-red-500 text-sm">{createState.error.url}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput(t('library.category') + " (Optional)","category", "", "text")}
                                            {createFormSubmitted && createState?.error?.category && <p className="text-red-500 text-sm">{createState.error.category}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('library.tags') + " (Optional)", "tags", "", "text")}
                                            {createFormSubmitted && createState?.error?.tags && <p className="text-red-500 text-sm">{createState.error.tags}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="access_level" className="text-sm font-medium">{t('library.access')}</label>
                                            <Select name="access_level">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder={t('library.select_access_level')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('library.access_level')}</SelectLabel>
                                                        <SelectItem value={openApi.LibraryAccessLevel.AllStudents}>{t('library.all_students')}</SelectItem>
                                                        <SelectItem value={openApi.LibraryAccessLevel.Groups}>{t('library.groups')}</SelectItem>
                                                        <SelectItem value={openApi.LibraryAccessLevel.SpecificStudents}>{t('library.specific_students')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createFormSubmitted && createState?.error?.access_level && <p className="text-red-500 text-sm">{createState.error.access_level}</p>}
                                    </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('library.thumbnail') + " (Optional)", "thumbnail", "", "text")}
                                            {createFormSubmitted && createState?.error?.thumbnail && <p className="text-red-500 text-sm">{createState.error.thumbnail}</p>}
                                        </div>
                                    </div>
                                    <div id="student_ids" className='flex flex-col'>
                                        <StudentMenu onStudentSelect={setSelectedStudentId}></StudentMenu>
                                    </div>
                                    {createFormSubmitted && createState?.message == 'fail'? <p className="text-red-500 text-sm">{t('library.create_failed')}</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={createPending}>{t('common.cancel')}</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? t('common.creating') : t('common.create')}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    {disableCreate ? <p className="text-amber-700 text-xs mt-2">{t('library.offline_only')}</p> : null}
                    </div>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">{t('library.get_item')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('library.get_item')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('library.get_item_description')}
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput(t('library.item_id'), "item-id", t('library.enter_item_id'), "number")}
                            {getFormSubmitted && getLibraryState?.message == 'fail'? <p className="text-red-500 text-sm">{t('library.get_item_failed')}</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getLibraryPending}>{t('common.cancel')}</AlertDialogCancel>
                            <Button type="submit" disabled={getLibraryPending}>{getLibraryPending? t('common.loading') : t('library.get')}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}