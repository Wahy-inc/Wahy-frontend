'use client'

import {ColumnDef} from "@tanstack/react-table";
import * as openApi from "@/lib/openApi"
import { useLocalization } from "@/lib/localization-context";

export function useColumnsWithLocalization() {
    const { t, language } = useLocalization();

    const columns: ColumnDef<openApi.LessonRead>[] = [
        {
            accessorKey: 'juz_number',
            header: t('lessons.juz'),
        },
        {
            accessorKey: 'surah_name',
            header: t('lessons.surah'),
        },
        {
            accessorKey: 'ayah_from',
            header: t('lessons.ayah_from'),
        },
        {
            accessorKey: 'ayah_to',
            header: t('lessons.ayah_to'),
        },
        {
            accessorKey: 'quality',
            header: t('lessons.quality'),
        },
    ]

    const HWcolumns: ColumnDef<openApi.LessonRead>[] = [
        {
            accessorKey: 'next_homework_type',
            header: t('lessons.type'),
        },
        {
            accessorKey: 'juz_number',
            header: t('lessons.juz'),
        },
        {
            accessorKey: 'next_homework_surah',
            header: t('lessons.surah'),
        },
        {
            accessorKey: 'next_homework_ayah_from',
            header: t('lessons.ayah_from'),
        },
        {
            accessorKey: 'next_homework_ayah_to',
            header: t('lessons.ayah_to'),
        },
        {
            accessorKey: 'next_homework_due_date',
            header: t('lessons.due_date'),
        }
    ]

    return { columns, HWcolumns, language, isRTL: language === 'ar' }
}