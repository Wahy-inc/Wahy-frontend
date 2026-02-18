import * as openApi from "@/lib/openApi"
import { DataTable } from "./data_table"
import { useColumnsWithLocalization } from "./columns"
import * as Icon from '@deemlol/next-icons'
import { useLocalization } from "@/lib/localization-context"

export default function LessonElement({lesson}: {lesson: openApi.LessonRead}) {
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
            </div>
        </div>
    )
}
