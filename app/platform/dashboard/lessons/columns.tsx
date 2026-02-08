'use client'

import {ColumnDef} from "@tanstack/react-table";
import * as openApi from "@/lib/openApi"

export const columns: ColumnDef<openApi.LessonRead>[] = [
    {
        accessorKey: 'type',
        header: 'Type',
    },
    {
        accessorKey: 'juz_number',
        header: 'Juz',
    },
    {
        accessorKey: 'surah_name',
        header: 'Surah',
    },
    {
        accessorKey: 'ayah_from',
        header: 'From Ayah',
    },
    {
        accessorKey: 'ayah_to',
        header: 'To Ayah',
    },
    {
        accessorKey: 'quality',
        header: 'Quality',
    },
    {
        accessorKey: 'attempts',
        header: 'Attempts',
    },
]

export const HWcolumns: ColumnDef<openApi.LessonRead>[] = [
    {
        accessorKey: 'next_homework_type',
        header: 'Type',
    },
    {
        accessorKey: 'juz_number',
        header: 'Juz',
    },
    {
        accessorKey: 'next_homework_surah',
        header: 'Surah',
    },
    {
        accessorKey: 'next_homework_ayah_from',
        header: 'From Ayah',
    },
    {
        accessorKey: 'next_homework_ayah_to',
        header: 'To Ayah',
    },
    {
        accessorKey: 'next_homework_due_date',
        header: 'Due Date',
    }
]