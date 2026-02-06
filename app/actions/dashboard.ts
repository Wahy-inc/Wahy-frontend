import { dummyLessons } from "@/lib/dummyData"
import * as openApi from "../../lib/openApi"
import { CreateLessonFormState, CreateScheduleFormState, createScheduleSchema, CreatLessonSchema, GetLessonByIDFormState, GetSchedualesForStudentFormState, SignInFormState, UpdateLessonFormState, UpdateLessonSchema, UpdateScheduleFormState, UpdateScheduleSchema } from "../lib/definitions"

const api = new openApi.Api({
    baseUrl: 'http://10.60.184.80:8000',
})

export async function studentData(id: number): Promise<openApi.StudentRead | null> {
    try {
        const response = await api.api.getOneApiV1StudentsStudentIdGet(id)
        if (response.status === 200) {
            return response.data
        }
        return null
    } catch (error) {
        return null
    }
}

export async function listStudents(): Promise<openApi.StudentRead[] | null> {
    try {
        const response = await api.api.listAllApiV1StudentsGet()

        if (response.status === 200) {
            return response.data
        }
        return null
    } catch (error) {
        return null
    }
}

export async function listSchedules(): Promise<openApi.ScheduleRead[] | null> {
    try {
        const response = await api.api.listAllApiV1SchedulesGet()

        if (response.status === 200) {
            return response.data
        }
        return null
    } catch (error) {
        return null
    }
}

export async function createSchedule(state: CreateScheduleFormState, formData: FormData): Promise<CreateScheduleFormState> {
    const validation = createScheduleSchema.safeParse({
        student_id: formData.get('student-id'),
        day_of_week: formData.get('day-of-week'),
        start_time: formData.get('start-time'),
        end_time: formData.get('end-time'),
        effective_from: formData.get('effective-from'),
        effective_until: formData.get('effective-until'),
        is_recurring: formData.get('is-recurring'),
        notes: formData.get('notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data:openApi.ScheduleCreate = {
            student_id: Number(validation.data.student_id),
            day_of_week: Number(validation.data.day_of_week),
            start_time: validation.data.start_time,
            end_time: validation.data.end_time,
            effective_from: validation.data.effective_from,
            effective_until: validation.data.effective_until,
            is_recurring: validation.data.is_recurring === 'true',
            notes: validation.data.notes,
        }
        const response = await api.api.createApiV1SchedulesPost(data)

        if (response.status === 201) {
            listSchedules() // Refresh the schedules list after creating a new schedule
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function updateSchedule(state: UpdateScheduleFormState, formData: FormData, scheduleId: number): Promise<UpdateScheduleFormState> {
    const validation = UpdateScheduleSchema.safeParse({
        day_of_week: formData.get('day-of-week'),
        start_time: formData.get('start-time'),
        end_time: formData.get('end-time'),
        effective_from: formData.get('effective-from'),
        effective_until: formData.get('effective-until'),
        is_recurring: formData.get('is-recurring'),
        is_active: formData.get('is-active'),
        cancellation_reason: formData.get('cancellation-reason'),
        notes: formData.get('notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data:openApi.ScheduleUpdate = {
            day_of_week: Number(validation.data.day_of_week),
            start_time: validation.data.start_time,
            end_time: validation.data.end_time,
            effective_from: validation.data.effective_from,
            effective_until: validation.data.effective_until,
            is_recurring: validation.data.is_recurring === 'true',
            is_active: validation.data.is_active === 'true',
            cancellation_reason: validation.data.cancellation_reason,
            notes: validation.data.notes,
        }
        const response = await api.api.updateApiV1SchedulesScheduleIdPatch(scheduleId, data)

        if (response.status === 200) {
            listSchedules() // Refresh the schedules list after updating a schedule
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function getSchedulesForStudent(state: GetSchedualesForStudentFormState, formData: FormData): Promise<GetSchedualesForStudentFormState> {
    const studentId = Number(formData.get('student-id'))
    if (isNaN(studentId)) {
        return { error: { student_id: ['Student ID must be a number'] } }
    }
    try {
        const response = await api.api.listForStudentApiV1SchedulesStudentStudentIdGet(studentId)

        if (response.status === 200) {
            return {message: 'success' , data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function listLessons(stu_id:number | null = null): Promise<openApi.LessonRead[] | null> {
    try {
        const response = await api.api.listAllApiV1LessonsGet({student_id: stu_id})

        if (response.status === 200) {
            return response.data
        }
        return null
    } catch (error) {
        return null
    }
}

export async function listLibrary(): Promise<openApi.LibraryItemRead[] | null> {
    try {
        const response = await api.api.listAllApiV1LibraryGet()

        if (response.status === 200) {
            return response.data
        }
        return null
    } catch (error) {
        return null
    }
}

export async function listInvoices(stu_id:number | null): Promise<openApi.InvoiceRead[] | null> {
    try {
        const response = await api.api.listAllApiV1InvoicesGet({student_id: stu_id})

        if (response.status === 200) {
            return response.data
        }
        return null
    } catch (error) {
        return null
    }
}

export async function getInvoice(id:number): Promise<openApi.InvoiceRead | null> {
    try {
        const response = await api.api.getOneApiV1InvoicesInvoiceIdGet(id)

        if (response.status === 200) {
            return response.data
        }
        return null
    } catch (error) {
        return null
    }
}

export async function createLesson(state: CreateLessonFormState, formData: FormData): Promise<CreateLessonFormState> {
    const validation = CreatLessonSchema.safeParse({
        student_id: formData.get('student-id'),
        schedule_id: formData.get('schedule-id'),
        sheikh_notes: formData.get('sheikh-notes'),
        student_notes: formData.get('student-notes'),
        date: formData.get('date'),
        type: formData.get('type'),
        attendance: formData.get('attendance'),
        juz: formData.get('juz'),
        surah: formData.get('surah'),
        ayah_from: formData.get('ayah-from'),
        ayah_to: formData.get('ayah-to'),
        quality: formData.get('quality'),
        attempts: formData.get('attempts'),
        absence_reason: formData.get('absence-reason'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data:openApi.LessonCreate = {
        student_id: Number(validation.data.student_id),
        schedule_id: Number(validation.data.schedule_id),
        sheikh_notes: validation.data.sheikh_notes,
        student_notes: validation.data.student_notes,
        date: validation.data.date,
        type: validation.data.type,
        attendance: validation.data.attendance,
        juz_number: Number(validation.data.juz),
        surah_name: validation.data.surah,
        ayah_from: Number(validation.data.ayah_from),
        ayah_to: Number(validation.data.ayah_to),
        quality: validation.data.quality,
        attempts: Number(validation.data.attempts),
        absence_reason: validation.data.absence_reason,
        }
        const response = await api.api.createApiV1LessonsPost(data)

        if (response.status === 201) {
            listLessons() // Refresh the lessons list after creating a new lesson
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function updateLesson(state: UpdateLessonFormState, formData: FormData, lessonId: number): Promise<UpdateLessonFormState> {
    const validation = UpdateLessonSchema.safeParse({
        schedule_id: formData.get('schedule-id'),
        sheikh_notes: formData.get('sheikh-notes'),
        student_notes: formData.get('student-notes'),
        date: formData.get('date'),
        type: formData.get('type'),
        attendance: formData.get('attendance'),
        juz: formData.get('juz'),
        surah: formData.get('surah'),
        ayah_from: formData.get('ayah-from'),
        ayah_to: formData.get('ayah-to'),
        quality: formData.get('quality'),
        attempts: formData.get('attempts'),
        absence_reason: formData.get('absence-reason'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data:openApi.LessonUpdate = {
        schedule_id: Number(validation.data.schedule_id),
        sheikh_notes: validation.data.sheikh_notes,
        student_notes: validation.data.student_notes,
        date: validation.data.date,
        type: validation.data.type,
        attendance: validation.data.attendance,
        juz_number: Number(validation.data.juz),
        surah_name: validation.data.surah,
        ayah_from: Number(validation.data.ayah_from),
        ayah_to: Number(validation.data.ayah_to),
        quality: validation.data.quality,
        attempts: Number(validation.data.attempts),
        absence_reason: validation.data.absence_reason,
        }
        const response = await api.api.updateApiV1LessonsLessonIdPatch(lessonId, data)

        if (response.status === 200) {
            listLessons() // Refresh the lessons list after creating a new lesson
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function getLessonByID(state:GetLessonByIDFormState, formData: FormData): Promise<GetLessonByIDFormState> {
    const lessonId = Number(formData.get('lesson-id'))
    if (isNaN(lessonId)) {
        return { error: { lesson_id: ['Lesson ID must be a number'] } }
    }
    try {
        const response = await api.api.getOneApiV1LessonsLessonIdGet(lessonId)

        if (response.status === 200) {
            return {message: 'success' , data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}