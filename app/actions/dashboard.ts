import * as openApi from "../../lib/openApi"

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

export async function listLessons(stu_id:number | null): Promise<openApi.LessonRead[] | null> {
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