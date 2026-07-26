import { getApi } from "@/lib/apiClient"
import * as openApi from "@/lib/openApi"
import { CreateScheduleFormState, createScheduleSchema, GetSchedualesForStudentFormState, UpdateScheduleFormState, UpdateScheduleSchema } from "@/app/platform/lib/definitions"
import { handleApiCall } from "./common"

const api = getApi()

export async function listSchedules(per_page: number, page: number): Promise<openApi.PaginatedResponse<openApi.ScheduleRead> | null> {
    const res = await handleApiCall(() => api.api.listAllApiV1SchedulesGet({ per_page, page }))
    return res.data ?? null
}

export async function listSchedulesMe(per_page: number, page: number): Promise<openApi.PaginatedResponse<openApi.ScheduleRead> | null> {
    const res = await handleApiCall(() => api.api.listMyScheduleApiV1SchedulesMeGet({ per_page, page }))
    return res.data ?? null
}

export async function createSchedule(state: CreateScheduleFormState, formData: FormData): Promise<CreateScheduleFormState> {
    const validation = createScheduleSchema.safeParse({
        student_id: formData.get('student_id'),
        start_time: formData.get('start-time'),
        end_time: formData.get('end-time'),
        effective_from: formData.get('effective-from'),
        rrule_string: formData.get('rrule_string'),
        notes: formData.get('notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const data: openApi.ScheduleCreate = {
        student_id: Number(validation.data.student_id),
        start_time: validation.data.start_time,
        end_time: validation.data.end_time,
        effective_from: validation.data.effective_from,
        rrule_string: validation.data.rrule_string,
        notes: validation.data.notes,
    }

    const res = await handleApiCall(() => api.api.createApiV1SchedulesPost(data), 201)
    return { message: res.message }
}

export async function updateSchedule(state: UpdateScheduleFormState, formData: FormData): Promise<UpdateScheduleFormState> {
    const scheduleId = Number(formData.get('schedule-id'))

    const validation = UpdateScheduleSchema.safeParse({
        start_time: formData.get('start-time'),
        end_time: formData.get('end-time'),
        effective_from: formData.get('effective-from'),
        rrule_string: formData.get('rrule_string'),
        is_active: formData.get('is-active'),
        cancellation_reason: formData.get('cancellation-reason'),
        notes: formData.get('notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const data: openApi.ScheduleUpdate = {
        start_time: validation.data.start_time,
        end_time: validation.data.end_time,
        effective_from: validation.data.effective_from,
        rrule_string: validation.data.rrule_string,
        is_active: validation.data.is_active === 'true',
        cancellation_reason: validation.data.cancellation_reason,
        notes: validation.data.notes,
    }

    const res = await handleApiCall(() => api.api.updateApiV1SchedulesScheduleIdPatch(scheduleId, data))
    return { message: res.message }
}

export async function getSchedulesForStudent(state: GetSchedualesForStudentFormState, formData: FormData): Promise<GetSchedualesForStudentFormState> {
    const studentId = Number(formData.get('student_id'))
    if (isNaN(studentId)) {
        return { message: 'fail', error: { student_id: ['Student ID must be a number'] } }
    }
    const res = await handleApiCall(() => api.api.listForStudentApiV1SchedulesStudentStudentIdGet(studentId))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

import { RRule } from '@martinhipp/rrule'

export async function deleteSchedule(scheduleId: number): Promise<boolean> {
    const res = await handleApiCall(() => api.api.deleteApiV1SchedulesScheduleIdDelete(scheduleId), 204)
    return res.message === 'success'
}

export async function addLocalSchedules(): Promise<boolean> {
    try {
        const response = await api.api.listAllApiV1SchedulesGet()
        if (!response.ok || !response.data) return false

        const schedules = response.data.items
        const ids: number[] = []
        schedules.forEach((schedule) => {
            if (!ids.includes(schedule.student_id)) ids.push(schedule.student_id)
        })

        const storeData: { id: number; schedules: ({ schedule_id: number; rrule: string[] | undefined } | undefined)[] }[] = []
        ids.forEach((id) => {
            const data = {
                id: id,
                schedules: schedules.filter((schedule) => schedule.student_id === id && schedule.is_active).map((sch) => {
                    if (!sch.rrule_string) return undefined
                    try {
                        const rruleString = sch.rrule_string.startsWith('RRULE:') ? sch.rrule_string : `RRULE:${sch.rrule_string}`
                        const rrule = RRule.fromString(rruleString)
                        const store = rrule.byweekday?.map((weekday) => `${weekday} | ${sch.start_time.slice(0, 5)} : ${sch.end_time.slice(0, 5)}`)
                        return { schedule_id: sch.id, rrule: store }
                    } catch {
                        return undefined
                    }
                })
            }
            storeData.push(data)
        })
        if (typeof window !== 'undefined') {
            localStorage.setItem('schedules', JSON.stringify(storeData))
        }
        return true
    } catch {
        return false
    }
}

export function getLocalSchedules(id: number | null): { id: number; schedules: ({ schedule_id: number; rrule: string[] | undefined } | undefined)[] }[] | null {
    if (id === undefined || id === null || typeof window === 'undefined') return null
    try {
        const data = localStorage.getItem('schedules')
        if (!data) return null
        const schedulesData = JSON.parse(data)
        return schedulesData.filter((schedule: { id: number }) => schedule.id === id)
    } catch {
        return null
    }
}
