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
import { CreateScheduleFormState, GetSchedualesForStudentFormState } from "@/app/platform/lib/definitions";

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
    handleClearFilter,
    handleSearchStudentId,
    searchStudentId,
    createAction,
    createPending,
    createState,
    getSchedualesForStudentAction,
    getSchedualesForStudentPending,
    getSchedualesForStudentState,
    fieldInput,
    createScheduleDialogOpen,
    setcreateScheduleDialogOpen,
    getStudentScheduleDialogOpen,
    setgetStudentScheduleDialogOpen,
}: {
        title: string,
        handleSearchStudentId: (e: React.ChangeEvent<HTMLInputElement>) => void,
        searchStudentId: string,
        handleClearFilter: () => void,
        getSchedualesForStudentState: GetSchedualesForStudentFormState,
        getSchedualesForStudentAction: (formData: FormData) => void,
        getSchedualesForStudentPending: boolean,
        createState: CreateScheduleFormState,
        createAction: (formData: FormData) => void,
        createPending: boolean,
        fieldInput: (label: string, name: string, holder: string, type: string) => JSX.Element,
        createScheduleDialogOpen: boolean,
        setcreateScheduleDialogOpen: (open: boolean) => void,
        getStudentScheduleDialogOpen: boolean,
        setgetStudentScheduleDialogOpen: (open: boolean) => void
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
                    <AlertDialog open={createScheduleDialogOpen} onOpenChange={createState?.message == 'success'? () => setcreateScheduleDialogOpen(false) : setcreateScheduleDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">Create Schedule</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={createAction}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Create Schedule</AlertDialogTitle>
                                <div className="flex flex-col gap-4">
                                    <div className='flex flex-col'>
                                        {fieldInput("Student ID","student-id", "Enter student id...", "number")}
                                        {createState?.error?.student_id && <p className="text-red-500 text-sm">{createState.error.student_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className='flex flex-col'>
                                            <div className="flex flex-col">
                                                <label htmlFor="day_of_week" className="text-sm font-medium">Day of Week</label>
                                                <Select name="day_of_week">
                                                    <SelectTrigger className="w-full max-w-48">
                                                        <SelectValue placeholder="Day of Week" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Day of Week</SelectLabel>
                                                            <SelectItem value={String(weekDays.saturday)}>Saturday</SelectItem>
                                                            <SelectItem value={String(weekDays.sunday)}>Sunday</SelectItem>
                                                            <SelectItem value={String(weekDays.monday)}>Monday</SelectItem>
                                                            <SelectItem value={String(weekDays.tuesday)}>Tuesday</SelectItem>
                                                            <SelectItem value={String(weekDays.wednesday)}>Wednesday</SelectItem>
                                                            <SelectItem value={String(weekDays.thursday)}>Thursday</SelectItem>
                                                            <SelectItem value={String(weekDays.friday)}>Friday</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {createState?.error?.day_of_week && <p className="text-red-500 text-sm">{createState.error.day_of_week}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Start Time", "start-time", "Select start time...", "time")}
                                            {createState?.error?.start_time && <p className="text-red-500 text-sm">{createState.error.start_time}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("End Time", "end-time", "Select end time...", "time")}
                                            {createState?.error?.end_time && <p className="text-red-500 text-sm">{createState.error.end_time}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput("Effective from","effective-from", "date", "date")}
                                            {createState?.error?.effective_from && <p className="text-red-500 text-sm">{createState.error.effective_from}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput("Effective until", "effective-until", "date", "date")}
                                            {createState?.error?.effective_until && <p className="text-red-500 text-sm">{createState.error.effective_until}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="flex flex-col">
                                            <label htmlFor="recurring" className="text-sm font-medium">Recurring</label>
                                            <Select name="recurring">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue placeholder="Recurring" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Recurring</SelectLabel>
                                                        <SelectItem value='true'>Yes</SelectItem>
                                                        <SelectItem value='false'>No</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {createState?.error?.is_recurring && <p className="text-red-500 text-sm">{createState.error.is_recurring}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput("Notes", "notes", "Enter notes...", "text")}
                                        {createState?.error?.notes && <p className="text-red-500 text-sm">{createState.error.notes}</p>}
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
                    <AlertDialog open={getStudentScheduleDialogOpen} onOpenChange={getSchedualesForStudentState?.message == 'success'? () => setgetStudentScheduleDialogOpen(false) : setgetStudentScheduleDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">Get Schedules for student</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={getSchedualesForStudentAction}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Get Schedules for student using ID</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter the ID of the student you want to retrieve schedules for. Make sure to enter a valid student ID to get the correct information.
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput("Student ID", "student-id", "Enter student ID...", "number")}
                            {getSchedualesForStudentState?.message == 'fail'? <p className="text-red-500 text-sm">Failed to fetch schedules. Please check the ID and try again.</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getSchedualesForStudentPending}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={getSchedualesForStudentPending}>{getSchedualesForStudentPending? 'Loading...' : 'Get'}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}