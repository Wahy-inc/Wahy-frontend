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
import React, { JSX, useState } from "react";
import { useLocalization } from "@/lib/localization-context";
import { CreateScheduleFormState, GetSchedualesForStudentFormState } from "@/app/platform/lib/definitions";
import StudentMenu from "@/components/studentsMenu";

export const weekDaysMap: Record<string, string> = {
    '0': 'saturday',
    '1': 'sunday',
    '2': 'monday',
    '3': 'tuesday',
    '4': 'wednesday',
    '5': 'thursday',
    '6': 'friday'
}

export const dayToRRuleMap: Record<string, string> = {
    '0': 'SA',
    '1': 'SU',
    '2': 'MO',
    '3': 'TU',
    '4': 'WE',
    '5': 'TH',
    '6': 'FR'
}

export const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)

export const generateRRule = (period: string, selectedDay: string, selectedDays: string[], selectedDayOfMonth: string, selectedDaysOfMonth: string[], effectiveUntil: string | null): string | null => {
    if (!period) return null
    
    let rrule = ''
    
    switch(period) {
        case 'daily':
            rrule = 'FREQ=DAILY'
            break
        case 'weekly':
            if (!selectedDay) return null
            const dayAbbr = dayToRRuleMap[selectedDay]
            rrule = `FREQ=WEEKLY;BYDAY=${dayAbbr}`
            break
        case 'customWeekly':
            if (selectedDays.length === 0) return null
            const dayAbbrs = selectedDays.map(day => dayToRRuleMap[day]).join(',')
            rrule = `FREQ=WEEKLY;BYDAY=${dayAbbrs}`
            break
        case 'monthly':
            if (!selectedDayOfMonth) return null
            rrule = `FREQ=MONTHLY;BYMONTHDAY=${selectedDayOfMonth}`
            break
        case 'customMonthly':
            if (selectedDaysOfMonth.length === 0) return null
            const monthDaysList = selectedDaysOfMonth.join(',')
            rrule = `FREQ=MONTHLY;BYMONTHDAY=${monthDaysList}`
            break
        default:
            return null
    }
    
    if (effectiveUntil) {
        // Convert date to RRULE format (YYYYMMDD)
        const dateParts = effectiveUntil.split('-')
        const rruleDate = dateParts.join('')
        rrule += `;UNTIL=${rruleDate}`
    }
    
    return rrule
}

export default function TitleElement({
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
        setgetStudentScheduleDialogOpen: (open: boolean) => void,
    }) {
    // Track if forms have been submitted in current dialog session
    const [createFormSubmitted, setCreateFormSubmitted] = useState(false)
    const [getFormSubmitted, setGetFormSubmitted] = useState(false)
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
    const { t } = useLocalization()
    const [isRecurring, setIsRecurring] = useState<string>('')
    const [isRecurringPeriod, setIsRecurringPeriod] = useState<string>('')
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<string>('')
    const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState<string[]>([])
    const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<string>('')
    const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState<string[]>([])

    const handleCreateDialogOpenChange = (open: boolean) => {
        if (!open) {
            setCreateFormSubmitted(false)
            setSelectedDayOfWeek('')     
            setSelectedDaysOfWeek([])    
            setIsRecurring('')            
            setIsRecurringPeriod('')     
        }
        if (createState?.message === 'success') {
            setcreateScheduleDialogOpen(false)
        } else {
            setcreateScheduleDialogOpen(open)
        }
    }

    const handleGetDialogOpenChange = (open: boolean) => {
        if (!open) {
            setGetFormSubmitted(false)
        }
        if (getSchedualesForStudentState?.message === 'success') {
            setgetStudentScheduleDialogOpen(false)
        } else {
            setgetStudentScheduleDialogOpen(open)
        }
    }

    const handleCreateSubmit = (formData: FormData) => {
        setCreateFormSubmitted(true)
        formData.append("student_id", selectedStudentId?.toString() || "")
        
        // Generate RRULE if recurring
        if (isRecurring === 'true') {
            const effectiveUntil = formData.get('effective-until') as string | null
            const rrule = generateRRule(isRecurringPeriod, selectedDayOfWeek, selectedDaysOfWeek, selectedDayOfMonth, selectedDaysOfMonth, effectiveUntil)
            if (rrule) {
                formData.append("rrule_string", rrule)
            }
        }
        
        createAction(formData)
    }

    const handleGetSubmit = (formData: FormData) => {
        setGetFormSubmitted(true)
        getSchedualesForStudentAction(formData)
    }

    const weekElement = (type: string) => weekDaysMap && Object.entries(weekDaysMap).map(([key, value]) => (
        <div key={key} className={`flex text-center items-center justify-center text-sm py-2 px-2 rounded-xl transition duration-300 cursor-pointer border border-slate-800 ${(selectedDayOfWeek === key || selectedDaysOfWeek.includes(key)) ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'}`} onClick={() => {
            if (type === 'weekly') {
                if (selectedDayOfWeek === key) {
                    setSelectedDayOfWeek('')
                } else {
                    setSelectedDayOfWeek(key)
                }
            } else if (type === 'customWeekly') {
                if (selectedDaysOfWeek.includes(key)) {
                    if (selectedDaysOfWeek.length === 1) {
                        setSelectedDaysOfWeek([])
                    } else {
                    setSelectedDaysOfWeek(selectedDaysOfWeek.filter(day => day !== key))
                    }
                } else {
                    setSelectedDaysOfWeek([...selectedDaysOfWeek, key])
                }
            }
        }}>
            {t(`schedules.${value}`)}
        </div>
    ))

    const monthElement = (type:string) => monthDays.map((day) => (
        <div key={day} className={`flex text-center items-center justify-center text-sm h-8 w-8 rounded-xl transition duration-300 cursor-pointer border border-slate-800 ${(selectedDayOfMonth === day.toString() || selectedDaysOfMonth.includes(day.toString())) ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'}`} onClick={() => {
            if (type === 'monthly') {
                if (selectedDayOfMonth === day.toString()) {
                    setSelectedDayOfMonth('')
                } else {
                    setSelectedDayOfMonth(day.toString())
                }
            } else if (type === 'customMonthly') {
                if (selectedDaysOfMonth.includes(day.toString())) {
                    if (selectedDaysOfMonth.length === 1) {
                        setSelectedDaysOfMonth([])
                    } else {
                    setSelectedDaysOfMonth(selectedDaysOfMonth.filter(d => d !== day.toString()))
                    }
                } else {
                    setSelectedDaysOfMonth([...selectedDaysOfMonth, day.toString()])
                }
            }
        }}>
            {day}
        </div>
    ))

    return (
            <div className="flex flex-col justify-center">
                <div className='flex flex-row justify-between items-center'>
                    <p className='text-5xl text-slate-950 font-bold mb-5'>{title}</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <Field orientation="horizontal" className='w-80'>
                            <Input onChange={handleSearchStudentId} id="student-id-search" name="student-id-search" type="search" placeholder={t('lessons.enter_student_id')} className='border-slate-950'/>
                            <div className="bg-slate-950 text-slate-100 border-slate-950 px-2 py-2 rounded-xl text-sm">{searchStudentId ? t('common.filtered') : t('common.search')}</div>
                        </Field>
                        {searchStudentId && (
                            <Button 
                                onClick={handleClearFilter}
                                variant="outline" 
                                className='transition duration-300 border border-red-500 rounded-xl text-red-500 bg-slate-100 hover:bg-red-500 hover:text-slate-100 cursor-pointer'
                            >
                                {t('common.clear')}
                            </Button>
                        )}
                    </div>
                </div>
                <div className="w-full grid grid-cols-3 gap-4 mt-4 mb-2">
                    <div>
                    <AlertDialog open={createScheduleDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 col-start-1 col-end-2 cursor-pointer">{t('schedules.create_schedule')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={handleCreateSubmit}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('schedules.create_title')}</AlertDialogTitle>
                                <div className="grid grid-cols-3 gap-4 rtl:text-right">
                                    <div className='flex flex-col col-start-1 col-end-4 row-start-1 row-end-2'>
                                        <StudentMenu onStudentSelect={setSelectedStudentId}></StudentMenu>
                                        {createFormSubmitted && createState?.error?.student_id && <p className="text-red-500 text-sm">{createState.error.student_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 col-start-1 col-end-4 row-start-2 row-end-3">
                                        <div className='flex flex-col col-start-1 col-end-2'>
                                            {fieldInput(t('schedules.start_time'), "start-time", t('schedules.select_start_time'), "time")}
                                            {createFormSubmitted && createState?.error?.start_time && <p className="text-red-500 text-sm">{createState.error.start_time}</p>}
                                        </div>
                                        <div className='flex flex-col col-start-2 col-end-3'>
                                            {fieldInput(t('schedules.end_time'), "end-time", t('schedules.select_end_time'), "time")}
                                            {createFormSubmitted && createState?.error?.end_time && <p className="text-red-500 text-sm">{createState.error.end_time}</p>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 col-start-1 col-end-4 row-start-3 row-end-4">
                                        <div className='flex flex-col col-start-1 col-end-2'>
                                            {fieldInput(t('schedules.effective_from'),"effective-from", "date", "date")}
                                            {createFormSubmitted && createState?.error?.effective_from && <p className="text-red-500 text-sm">{createState.error.effective_from}</p>}
                                        </div>
                                        <div className='flex flex-col col-start-2 col-end-3'>
                                            {fieldInput(t('schedules.effective_until'), "effective-until", "date", "date")}
                                            {createFormSubmitted && createState?.error?.effective_until && <p className="text-red-500 text-sm">{createState.error.effective_until}</p>}
                                        </div>
                                    </div>
                                    <div className='flex flex-col col-start-1 col-end-3 row-start-4 row-end-5'>
                                        <div className="flex flex-col">
                                            <label htmlFor="is-recurring" className="text-sm font-medium">{t('schedules.recurring')}</label>
                                            <Select name="is-recurring" onValueChange={(value) => setIsRecurring(value)}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue id="selected-recurr-value" placeholder={t('schedules.recurring')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('schedules.recurring')}</SelectLabel>
                                                        <SelectItem value='true'>{t('common.yes')}</SelectItem>
                                                        <SelectItem value='false'>{t('common.no')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {isRecurring === 'true' && (
                                    <div className='flex flex-col col-start-3 col-end-4 row-start-4 row-end-5'>
                                        <div className="flex flex-col">
                                            <label htmlFor="is-recurring-period" className="text-sm font-medium">Period</label>
                                            <Select name="is-recurring-period" onValueChange={(value) => {
                                                setIsRecurringPeriod(value)
                                                setSelectedDayOfWeek('')
                                                setSelectedDaysOfWeek([])
                                                setSelectedDayOfMonth('')
                                                setSelectedDaysOfMonth([])
                                            }}>
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue id="selected-recurr-value" placeholder={t('schedules.recurring')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Period</SelectLabel>
                                                        <SelectItem value='daily'>Daily</SelectItem>
                                                        <SelectItem value='weekly'>Weekly</SelectItem>
                                                        <SelectItem value='monthly'>Monthly</SelectItem>
                                                        <SelectItem value='customWeekly'>Custom Weekly</SelectItem>
                                                        <SelectItem value='customMonthly'>Custom Monthly</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>)}
                                    <div className="col-start-1 col-end-4 row-start-5 row-end-6 flex-wrap flex flex-row gap-1 rounded-xl justify-start">
                                        {isRecurring === 'true' && (isRecurringPeriod === 'weekly' || isRecurringPeriod === 'customWeekly') && (
                                                weekElement(isRecurringPeriod)
                                            )}
                                        {isRecurring === 'true' && (isRecurringPeriod === 'monthly' || isRecurringPeriod === 'customMonthly') && (
                                                monthElement(isRecurringPeriod)
                                            )}
                                    </div>
                                    <div className='flex flex-col col-start-1 col-end-4 row-start-6 row-end-7'>
                                        {fieldInput(t('schedules.notes'), "notes", t('schedules.enter_notes'), "text")}
                                        {createFormSubmitted && createState?.error?.notes && <p className="text-red-500 text-sm">{createState.error.notes}</p>}
                                    </div>
                                    {createFormSubmitted && createState?.message == 'fail'? <p className="text-red-500 text-sm">{t('schedules.create_failed')}</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel type="reset" disabled={createPending}>{t('common.cancel')}</AlertDialogCancel>
                                <Button type="submit" disabled={createPending}>{createPending ? t('common.creating') : t('common.create')}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
                    </div>
                    <AlertDialog open={getStudentScheduleDialogOpen} onOpenChange={handleGetDialogOpenChange}>
                    <AlertDialogTrigger asChild>
                        <Button className="transition duration-300 col-start-3 col-end-4 cursor-pointer bg-slate-100 border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-slate-100">{t('schedules.get_schedules')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <form action={handleGetSubmit}>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('schedules.get_schedules_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('schedules.get_schedules_desc')}
                        </AlertDialogDescription>
                        <div className="flex flex-col gap-4 w-full">
                            {fieldInput(t('schedules.student_id'), "student-id", t('schedules.enter_student_id'), "number")}
                            {getFormSubmitted && getSchedualesForStudentState?.message == 'fail'? <p className="text-red-500 text-sm">{t('schedules.get_error')}</p> : null}
                        </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel type="reset" disabled={getSchedualesForStudentPending}>{t('common.cancel')}</AlertDialogCancel>
                            <Button type="submit" disabled={getSchedualesForStudentPending}>{getSchedualesForStudentPending? t('common.loading') : t('common.submit')}</Button>
                        </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
    )
}