import * as openApi from "@/lib/openApi"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "./data_table"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useColumnsWithLocalization } from "./columns"
import * as Icon from '@deemlol/next-icons'
import { JSX } from "react"
import { UpdateLessonFormState } from "@/app/platform/lib/definitions"
import { useLocalization } from "@/lib/localization-context"

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

export default function LessonElement({lesson, updateAction, updateState, updatePending, setUpdateLessonDialogOpen, updateLessonDialogOpen, fieldInput}: {lesson: openApi.LessonRead, updateAction: (formData: FormData) => void, updateState: UpdateLessonFormState | null | undefined, updatePending: boolean, setUpdateLessonDialogOpen: (open: boolean) => void, updateLessonDialogOpen: boolean, fieldInput: (label: string, name: string, defaultValue: string, type: string) => JSX.Element}) {
    const { t } = useLocalization()
    const { columns, HWcolumns, isRTL } = useColumnsWithLocalization()
    return (
        <div className="overflow-hidden border-2 rounded-xl bg-white flex flex-col justify-start my-5 p-4 shadow-[0px_4px_30px_rgba(0,0,0,0.1)] opacity-90 backdrop-blur-sm hover:opacity-80 transition duration-300 hover:scale-101" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className='flex flex-col justify-center items-start mb-4'>
                <p id="name" className="text-3xl text-slate-800">{t('lessons.id')}: {lesson.id}</p>
                <div className={`grid grid-cols-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="text-xl text-slate-600 flex items-center col-start-1 col-end-2"><Icon.Calendar className="inline pr-1"/>: {lesson.date}</p>
                    <p className="text-xl text-slate-600 flex items-center col-start-2 col-end-3"><Icon.Clock className="inline pr-1"/> {t('lessons.attendance')}: {lesson.attendance}</p>
                </div>
            </div>
            <div className="mb-2">
                <p className="text-lg text-slate-600 pb-0.5">{t('lessons.recited')}</p>
                <DataTable columns={columns} data={[lesson]} isRTL={isRTL} />
            </div>
            <div className="mb-2">
                <p className="text-lg text-slate-600 pb-0.5">{t('lessons.new_memorization')}</p>
                <DataTable columns={HWcolumns} data={[lesson]} isRTL={isRTL} />
            </div>
            {lesson.absence_reason && <p className={`w-full text-[12px] text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}><span className="font-bold text-slate-800">{t('lessons.absence_reason')}</span> &quot;{lesson.absence_reason}&quot;</p>}
            {lesson.sheikh_notes && <p className={`w-full text-[12px] text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}><span className="font-bold text-slate-800">{t('lessons.sheikh_notes')}</span> &quot;{lesson.sheikh_notes}&quot;</p>}
            {lesson.student_notes && <p className={`w-full text-[12px] text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}><span className="font-bold text-slate-800">{t('lessons.student_notes')}</span> &quot;{lesson.student_notes}&quot;</p>}
            <div className={`flex flex-row ${isRTL ? 'flex-row-reverse' : ''} justify-end`}>
                    <AlertDialog open={updateLessonDialogOpen} onOpenChange={updateState?.message == 'success'? () => setUpdateLessonDialogOpen(false) : setUpdateLessonDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button className="transition duration-300 mt-4 cursor-pointer bg-slate-400 hover:bg-slate-600">{t('lessons.update_lesson')}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <form action={updateAction} className="w-full bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{t('lessons.update_lesson')}</AlertDialogTitle>
                                <div className={`flex flex-col gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <input type="hidden" name="lesson-id" value={lesson.id} />
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.schedule_id'), "schedule-id", String(lesson.schedule_id), "number")}
                                        {updateState?.error?.schedule_id && <p className="text-red-500 text-sm">{updateState.error.schedule_id}</p>}
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.date'), "date", String(lesson.date), "date")}
                                            {updateState?.error?.date && <p className="text-red-500 text-sm">{updateState.error.date}</p>}
                                        </div>
                                    <div className='flex flex-col'>
                                        <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                                            <label htmlFor="type" className="text-sm font-medium">{t('lessons.type')}</label>
                                            <Select defaultValue={lesson.type} name="type">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('lessons.type')}</SelectLabel>
                                                        <SelectItem value={openApi.LessonType.Evaluation}>{t('lessons.evaluation')}</SelectItem>
                                                        <SelectItem value={openApi.LessonType.NewMemorization}>{t('lessons.new_memorization')}</SelectItem>
                                                        <SelectItem value={openApi.LessonType.Revision}>{t('lessons.revision')}</SelectItem>
                                                        <SelectItem value={openApi.LessonType.Makeup}>{t('lessons.makeup')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateState?.error?.type && <p className="text-red-500 text-sm">{updateState.error.type}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                                            <label htmlFor="attendance" className="text-sm font-medium">{t('lessons.attendance')}</label>
                                            <Select defaultValue={lesson.attendance} name="attendance">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('lessons.attendance')}</SelectLabel>
                                                        <SelectItem value={openApi.AttendanceStatus.Present}>{t('lessons.present')}</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Absent}>{t('lessons.absent')}</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Excused}>{t('lessons.excused')}</SelectItem>
                                                        <SelectItem value={openApi.AttendanceStatus.Late}>{t('lessons.late')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateState?.error?.attendance && <p className="text-red-500 text-sm">{updateState.error.attendance}</p>}
                                    </div>
                                    </div>
                                    <div className={`grid grid-cols-4 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.juz'),"juz", String(lesson.juz_number), "number")}
                                            {updateState?.error?.juz && <p className="text-red-500 text-sm">{updateState.error.juz}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.surah'), "surah", String(lesson.surah_name), "text")}
                                            {updateState?.error?.surah && <p className="text-red-500 text-sm">{updateState.error.surah}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.ayah_from'), "ayah-from", String(lesson.ayah_from), "number")}
                                            {updateState?.error?.ayah_from && <p className="text-red-500 text-sm">{updateState.error.ayah_from}</p>}
                                        </div>
                                        <div className='flex flex-col'>
                                            {fieldInput(t('lessons.ayah_to'), "ayah-to", String(lesson.ayah_to), "number")}
                                            {updateState?.error?.ayah_to && <p className="text-red-500 text-sm">{updateState.error.ayah_to}</p>}
                                        </div>
                                    </div>
                                    <div className={`grid grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className='flex flex-col'>
                                        <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
                                            <label htmlFor="quality" className="text-sm font-medium">{t('lessons.quality')}</label>
                                            <Select defaultValue={getQuality(lesson.quality)} name="quality">
                                                <SelectTrigger className="w-full max-w-48">
                                                    <SelectValue/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>{t('lessons.quality')}</SelectLabel>
                                                        <SelectItem value={openApi.LessonQuality.Excellent}>{t('lessons.excellent')}</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.VeryGood}>{t('lessons.very_good')}</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.Good}>{t('lessons.good')}</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.Fair}>{t('lessons.fair')}</SelectItem>
                                                        <SelectItem value={openApi.LessonQuality.NeedsImprovement}>{t('lessons.needs_improvement')}</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {updateState?.error?.quality && <p className="text-red-500 text-sm">{updateState.error.quality}</p>}
                                    </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.absence_reason'), "absence-reason", String(lesson.absence_reason), "text")}
                                        {updateState?.error?.absence_reason && <p className="text-red-500 text-sm">{updateState.error.absence_reason}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.sheikh_notes'), "sheikh-notes", String(lesson.sheikh_notes), "text")}
                                        {updateState?.error?.sheikh_notes && <p className="text-red-500 text-sm">{updateState.error.sheikh_notes}</p>}
                                    </div>
                                    <div className='flex flex-col'>
                                        {fieldInput(t('lessons.student_notes'), "student-notes", String(lesson.student_notes), "text")}
                                        {updateState?.error?.student_notes && <p className="text-red-500 text-sm">{updateState.error.student_notes}</p>}
                                    </div>
                                    {updateState?.message == 'fail'? <p className="text-red-500 text-sm">{t('lessons.update_failed')}</p> : null}
                                </div>
                            </AlertDialogHeader>
                            <AlertDialogFooter className={`mt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <AlertDialogCancel type="reset" disabled={updatePending}>{t('common.cancel')}</AlertDialogCancel>
                                <Button type="submit" disabled={updatePending}>{updatePending ? t('common.updating') : t('common.update')}</Button>
                            </AlertDialogFooter>
                            </form>
                        </AlertDialogContent>
                    </AlertDialog>
            </div>
        </div>
    )
}
