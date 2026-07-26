import { getApi } from "@/lib/apiClient"
import * as openApi from "@/lib/openApi"
import { CreateStudentFormState, createStudentSchema, GetStudentFormState, UpdateStudentFormState, updateStudentSchema } from "@/app/platform/lib/definitions"
import { handleApiCall } from "./common"

const api = getApi()

export async function studentData(id: number): Promise<openApi.StudentRead | null> {
    const res = await handleApiCall(() => api.api.getOneApiV1StudentsStudentIdGet(id))
    return res.data ?? null
}

export async function getStudentMe(): Promise<openApi.StudentSelfRead | null> {
    const res = await handleApiCall(() => api.api.getMeApiV1StudentsMeGet())
    return res.data ?? null
}

export async function listStudents(per_page: number, page: number): Promise<openApi.PaginatedResponse<openApi.StudentRead> | null> {
    const res = await handleApiCall(() => api.api.listAllApiV1StudentsGet({ per_page, page }))
    if (res.data) {
        const filteredData = res.data.items.filter(stu => stu.status === 'active' || stu.status === 'graduated')
        const students = filteredData.map((student) => ({
            student_id: student.id,
            full_name_arabic: student.full_name_arabic,
            full_name_english: student.full_name_english,
        }))
        if (typeof window !== 'undefined') {
            localStorage.setItem('students', JSON.stringify(students))
        }
    }
    return res.data ?? null
}

export function getLocalStudent(id: number) {
    if (typeof window === 'undefined') return null
    try {
        const students = localStorage.getItem('students')
        if (!students) return null
        const studentsArray = JSON.parse(students)
        const found = studentsArray.find((student: { student_id: number }) => student.student_id === id)
        return found ? { full_name_arabic: found.full_name_arabic, full_name_english: found.full_name_english } : null
    } catch {
        return null
    }
}

export async function createStudent(state: CreateStudentFormState, formData: FormData): Promise<CreateStudentFormState> {
    const validation = createStudentSchema.safeParse({
        arname: formData.get('ar-name'),
        enname: formData.get('en-name'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('date-of-birth'),
        timeZone: formData.get('time-zone'),
        lessonsPerWeek: formData.get('lessons-per-week'),
        lessonRate: formData.get('lessons-rate'),
        billingCycle: formData.get('billingCycle'),
        specialNotes: formData.get('special-notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const data: openApi.StudentSignupRequest = {
        full_name_arabic: validation.data.arname,
        full_name_english: validation.data.enname,
        date_of_birth: validation.data.dateOfBirth,
        phone: validation.data.phone,
        timezone: validation.data.timeZone,
        lessons_per_week: Number(validation.data.lessonsPerWeek),
        lesson_rate: Number(validation.data.lessonRate),
        billing_cycle: validation.data.billingCycle as openApi.BillingCycle,
        special_notes: validation.data.specialNotes,
    }

    const res = await handleApiCall(() => api.api.createApiV1StudentsPost(data), 201, 'creation successful')
    return { message: res.message }
}

export async function getStudent(state: GetStudentFormState, formData: FormData): Promise<GetStudentFormState> {
    const id = Number(formData.get('student-id'))
    if (isNaN(id)) {
        return { error: { id: ['Student ID must be a number'] } }
    }
    const res = await handleApiCall(() => api.api.getOneApiV1StudentsStudentIdGet(id))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function updateStudent(state: UpdateStudentFormState, formData: FormData, studentId: number): Promise<UpdateStudentFormState> {
    const validation = updateStudentSchema.safeParse({
        arname: formData.get('ar-name'),
        enname: formData.get('en-name'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('date-of-birth'),
        timeZone: formData.get('time-zone'),
        currjuz: formData.get('current-juz'),
        currsurah: formData.get('current-surah'),
        currayah: formData.get('current-ayah'),
        lessonsPerWeek: formData.get('lessons-per-week'),
        lessonRate: formData.get('lesson-rate'),
        billingCycle: formData.get('billing-cycle'),
        specialNotes: formData.get('special-notes'),
        privateNotes: formData.get('private-notes'),
        registerationStatus: formData.get('registeration-status'),
        status: formData.get('status'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const data: openApi.StudentUpdate = {
        full_name_arabic: validation.data.arname,
        full_name_english: validation.data.enname,
        phone: validation.data.phone,
        date_of_birth: validation.data.dateOfBirth,
        timezone: validation.data.timeZone,
        status: validation.data.status as openApi.StudentStatus | undefined,
        lessons_per_week: Number(validation.data.lessonsPerWeek),
        lesson_rate: Number(validation.data.lessonRate),
        billing_cycle: validation.data.billingCycle as openApi.BillingCycle,
        special_notes: validation.data.specialNotes,
    }

    const res = await handleApiCall(() => api.api.updateApiV1StudentsStudentIdPatch(studentId, data))
    return { message: res.message }
}

export async function approveStudent(id: number, note: openApi.StudentApprovalRequest): Promise<'success' | 'queued' | 'fail'> {
    const studentId = Number(id)
    if (isNaN(studentId)) return 'fail'
    const res = await handleApiCall(() => api.api.approveApiV1StudentsStudentIdApprovePost(id, note))
    return res.data !== undefined || res.message === 'success' ? 'success' : 'fail'
}

export async function rejectStudent(id: number, note: openApi.StudentApprovalRequest): Promise<'success' | 'queued' | 'fail'> {
    const studentId = Number(id)
    if (isNaN(studentId)) return 'fail'
    const res = await handleApiCall(() => api.api.rejectApiV1StudentsStudentIdRejectPost(id, note))
    return res.data !== undefined || res.message === 'success' ? 'success' : 'fail'
}
