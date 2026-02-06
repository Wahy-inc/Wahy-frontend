import * as openApi from "../../lib/openApi"
import { CreateLessonFormState, CreatLessonSchema, SignInFormState } from "../lib/definitions"

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

export async function listScheduals(): Promise<openApi.ScheduleRead[] | null> {
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
        const data:openApi.LessonCreate = validation.data
        const response = await api.api.createApiV1LessonsPost(data)

        if (response.status === 201) {
            listLessons() // Refresh the lessons list after creating a new lesson
            return {message: 'success' }
        }
        return {message: response.error?.detail?.[0]?.msg || 'Failed to create lesson' }
    } catch (error) {
        return { message: 'An error occurred while creating the lesson' }
    }
}