import { getApi } from "@/lib/apiClient"
import * as openApi from "@/lib/openApi"
import { CreateLessonFormState, CreatLessonSchema, GetLessonByDayFormState, getLessonHistoryState, UpdateLessonFormState, UpdateLessonSchema } from "@/app/platform/lib/definitions"
import { DeleteClassFileResponseState, ListUploadedClassFilesResponseState, uploadClassFileResponseState } from "../lib/definitions"
import { handleApiCall } from "./common"

const api = getApi()

export async function listLessons(): Promise<openApi.ClassGroupItem[]> {
    const res = await handleApiCall(() => api.api.listClassesApiV2ClassesGet())
    return res.data?.classes ?? []
}

export async function listLessonsMe(): Promise<openApi.ClassGroupItem[]> {
    const res = await handleApiCall(() => api.api.listMyClassesApiV2ClassesMeGet())
    if (!res.data?.classes) return []

    const results: openApi.ClassGroupItem[] = []
    for (const lesson of res.data.classes) {
        if (!results.some(r => r.schedule_id === lesson.schedule_id && r.day_label === lesson.day_label)) {
            results.push(lesson)
        }
    }
    return results
}

export async function createLesson(state: CreateLessonFormState, formData: FormData): Promise<CreateLessonFormState> {
    const validation = CreatLessonSchema.safeParse({
        student_id: formData.get('student_id'),
        schedule_id: formData.get('schedule_id'),
        sheikh_notes: formData.get('sheikh_notes'),
        student_notes: formData.get('student_notes'),
        date: formData.get('date'),
        attendance: formData.get('attendance'),
        what_is_heard_from_sheikh: formData.get('what_is_heard_from_sheikh'),
        homework: formData.get('homework'),
    })

    if (!validation.success) {
        return { message: 'fail', error: validation.error.flatten().fieldErrors }
    }

    const data: openApi.LessonCreate = {
        student_id: Number(validation.data.student_id),
        schedule_id: Number(validation.data.schedule_id),
        date: validation.data.date,
        attendance: validation.data.attendance,
        student_notes: validation.data.student_notes,
        sheikh_notes: validation.data.sheikh_notes,
        what_is_heard_from_sheikh: validation.data.what_is_heard_from_sheikh,
        homework: validation.data.homework,
    }

    const res = await handleApiCall(() => api.api.createApiV1LessonsPost(data), 201)
    return { message: res.message }
}

export async function updateLesson(state: UpdateLessonFormState, formData: FormData): Promise<UpdateLessonFormState> {
    const validation = UpdateLessonSchema.safeParse({
        id: formData.get('lesson-id'),
        sheikh_notes: formData.get('sheikh_notes'),
        student_notes: formData.get('student_notes'),
        date: formData.get('date'),
        attendance: formData.get('attendance'),
        what_is_heard_from_sheikh: formData.get('what_is_heard_from_sheikh'),
        homework: formData.get('homework'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const data: openApi.LessonUpdate = {
        date: validation.data.date,
        attendance: validation.data.attendance,
        student_notes: validation.data.student_notes,
        sheikh_notes: validation.data.sheikh_notes,
        what_is_heard_from_sheikh: validation.data.what_is_heard_from_sheikh,
        homework: validation.data.homework,
    }

    const res = await handleApiCall(() => api.api.updateApiV1LessonsLessonIdPatch(Number(validation.data.id), data))
    return { message: res.message }
}

export async function getLessonByDay(state: GetLessonByDayFormState, formData: FormData): Promise<GetLessonByDayFormState> {
    const lessonDay = formData.get('lesson-day')
    const res = await handleApiCall(() => api.api.listClassesApiV2ClassesGet())
    if (!res.data?.classes) return { message: 'fail' }
    const lessons = res.data.classes.filter(lesson => lesson.day_label === lessonDay)
    return { message: 'success', data: lessons }
}

export async function getLessonByDayMe(state: GetLessonByDayFormState, formData: FormData): Promise<GetLessonByDayFormState> {
    const lessonDay = formData.get('lesson-day')
    const res = await handleApiCall(() => api.api.listMyClassesApiV2ClassesMeGet())
    if (!res.data?.classes) return { message: 'fail' }
    const lessons = res.data.classes.filter(lesson => lesson.day_label === lessonDay)
    return { message: 'success', data: lessons }
}

export async function getLessonHistory(state: getLessonHistoryState, scheduleID: number): Promise<getLessonHistoryState> {
    const res = await handleApiCall(() => api.api.getHistoryApiV2ClassesScheduleIdHistoryGet(scheduleID))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function getMeMyLessonHistory(state: getLessonHistoryState, scheduleID: number): Promise<getLessonHistoryState> {
    const res = await handleApiCall(() => api.api.getMyHistoryApiV2ClassesMeScheduleIdHistoryGet(scheduleID))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function uploadClassFile(state: uploadClassFileResponseState, formData: FormData): Promise<uploadClassFileResponseState> {
    const scheduleId = Number(formData.get('schedule_id'))
    const file = formData.get('file') as File
    if (!file || !scheduleId) return { message: 'fail' }

    const res = await handleApiCall(() => api.api.uploadClassFileApiV2ClassFilesScheduleIdFilesPost(scheduleId, { file }), 201)
    return { message: res.message, data: res.data }
}

export async function listClassFiles(scheduleId: number): Promise<ListUploadedClassFilesResponseState> {
    const res = await handleApiCall(() => api.api.listClassFilesApiV2ClassFilesScheduleIdFilesGet(scheduleId))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function deleteClassFile(scheduleId: number, fileId: number): Promise<DeleteClassFileResponseState> {
    const res = await handleApiCall(() => api.api.deleteClassFileApiV2ClassFilesScheduleIdFilesFileIdDelete(scheduleId, fileId), 204)
    return { message: res.message }
}

export async function downloadClassFile(scheduleId: number, fileId: number): Promise<boolean> {
    try {
        const response = await api.api.downloadClassFileApiV2ClassFilesScheduleIdFilesFileIdGet(scheduleId, fileId, { format: 'blob' })
        if (response.status === 200 && response.data instanceof Blob) {
            const blob = response.data
            if (blob.size < 10) return false

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `classfile_${fileId}`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            return true
        }
        return false
    } catch {
        return false
    }
}
