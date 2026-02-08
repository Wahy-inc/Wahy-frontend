import * as openApi from "@/lib/openApi"
import { CreateLessonFormState, CreateLibraryItemFormState, createLibraryItemSchema, CreateScheduleFormState, createScheduleSchema, CreateStudentFormState, createStudentSchema, CreatLessonSchema, GetLessonByIDFormState, GetLibraryItemByIDFormState, GetSchedualesForStudentFormState, GetStudentFormState, SignInFormState, UpdateLessonFormState, UpdateLessonSchema, UpdateScheduleFormState, UpdateScheduleSchema, UpdateStudentFormState } from "@/app/platform/lib/definitions"

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

export async function createStudent(state: CreateStudentFormState, formData: FormData): Promise<CreateStudentFormState> {
    const validation = createStudentSchema.safeParse({
        id: formData.get('id'),
        arname: formData.get('ar-name'),
        enname: formData.get('en-name'),
        phone: formData.get('phone'),
        date_of_birth: formData.get('date-of-birth'),
        timezone: formData.get('time-zone'),
        current_juz: formData.get('current-juz'),
        current_surah: formData.get('current-surah'),
        current_ayah: formData.get('current-ayah'),
        lessons_per_week: formData.get('lessons-per-week'),
        lesson_rate: formData.get('lesson-rate'),
        billing_cycle: formData.get('billing-cycle'),
        special_notes: formData.get('special-notes'),
        private_notes: formData.get('private-notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    try {
        const data: openApi.StudentCreate = {
            user_id: Number(validation.data.id),
            full_name_arabic: validation.data.arname,
            full_name_english: validation.data.enname,
            phone: validation.data.phone,
            date_of_birth: validation.data.dateOfBirth,
            timezone: validation.data.timeZone,
            current_juz: Number(validation.data.currjuz),
            current_surah: validation.data.currsurah,
            current_ayah: Number(validation.data.currayah),
            lessons_per_week: Number(validation.data.lessonsPerWeek),
            lesson_rate: Number(validation.data.lessonRate),
            billing_cycle: validation.data.BillingCycle as openApi.BillingCycle,
            special_notes: validation.data.specialNotes,
            private_notes: validation.data.privateNotes,
        }
        const response = await api.api.createApiV1StudentsPost(data)

        if (response.status === 201) {
            listStudents() // Refresh the students list after creating a new student
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function getStudent(state: GetStudentFormState, formData: FormData): Promise<GetStudentFormState> {
    const id = Number(formData.get('student-id'))

    if (isNaN(id)) {
        return { error: { id: ['Student ID must be a number'] } }
    }

    try {
        const response = await api.api.getOneApiV1StudentsStudentIdGet(id)
        if (response.status === 200) {
            return { data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function updateStudent(state: UpdateStudentFormState, formData: FormData, studentId: number): Promise<UpdateStudentFormState> {
    const validation = createStudentSchema.safeParse({
        arname: formData.get('ar-name'),
        enname: formData.get('en-name'),
        phone: formData.get('phone'),
        date_of_birth: formData.get('date-of-birth'),
        timezone: formData.get('time-zone'),
        current_juz: formData.get('current-juz'),
        current_surah: formData.get('current-surah'),
        current_ayah: formData.get('current-ayah'),
        lessons_per_week: formData.get('lessons-per-week'),
        lesson_rate: formData.get('lesson-rate'),
        billing_cycle: formData.get('billing-cycle'),
        special_notes: formData.get('special-notes'),
        private_notes: formData.get('private-notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    try {
        const data: openApi.StudentUpdate = {
            full_name_arabic: validation.data.arname,
            full_name_english: validation.data.enname,
            phone: validation.data.phone,
            date_of_birth: validation.data.dateOfBirth,
            timezone: validation.data.timeZone,
            current_juz: Number(validation.data.currjuz),
            current_surah: validation.data.currsurah,
            current_ayah: Number(validation.data.currayah),
            lessons_per_week: Number(validation.data.lessonsPerWeek),
            lesson_rate: Number(validation.data.lessonRate),
            billing_cycle: validation.data.BillingCycle as openApi.BillingCycle,
            special_notes: validation.data.specialNotes,
            private_notes: validation.data.privateNotes,
        }
        const response = await api.api.updateApiV1StudentsStudentIdPatch(studentId, data)

        if (response.status === 200) {
            listStudents() // Refresh the students list after updating a student
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function approveStudent(id:number, note: openApi.StudentApprovalRequest): Promise<boolean> {
    const studentId = Number(id)
    if (isNaN(studentId)) {
        return false
    }
    try {
        const response = await api.api.approveApiV1StudentsStudentIdApprovePost(id, note)
        if (response.status === 200) {
            listStudents() // Refresh the students list after approving a student
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

export async function rejectStudent(id:number, note: openApi.StudentApprovalRequest): Promise<boolean> {
    const studentId = Number(id)
    if (isNaN(studentId)) {
        return false
    }
    try {
        const response = await api.api.rejectApiV1StudentsStudentIdRejectPost(id, note)
        if (response.status === 200) {
            listStudents() // Refresh the students list after approving a student
            return true
        }
        return false
    } catch (error) {
        return false
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

export async function deleteSchedule(scheduleId: number): Promise<boolean> {
    try {
        const response = await api.api.deleteApiV1SchedulesScheduleIdDelete(scheduleId)

        if (response.status === 204) {
            listSchedules() // Refresh the schedules list after deleting a schedule
            return true
        }
        return false
    }   catch (error) {
        return false
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

export async function getLibraryItem(state: GetLibraryItemByIDFormState, formData: FormData): Promise<GetLibraryItemByIDFormState> {
    const id = Number(formData.get('item-id'))
    if (isNaN(id)) {
        return { error: { item_id: ['Item ID must be a number'] } }
    }
    try {
        const response = await api.api.getOneApiV1LibraryItemIdGet(id)

        if (response.status === 200) {
            return {message: 'success', data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function createLibraryItem(state: CreateLibraryItemFormState, formData: FormData): Promise<CreateLibraryItemFormState> {
    const validation = createLibraryItemSchema.safeParse({
        title: formData.get('title'),
        url: formData.get('url'),
        description: formData.get('description'),
        category: formData.get('category'),
        tags: formData.get('tags'),
        access_level: formData.get('access_level'),
        thumbnail: formData.get('thumbnail'),
        student_ids: formData.get('students_ids'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data = {
            title: validation.data.title,
            external_url: validation.data.url,
            description: validation.data.description,
            category: validation.data.category,
            tags: validation.data.tags.split(',').map(tag => tag.trim()),
            access_level: validation.data.access_level,
            thumbnail_image_path: validation.data.thumbnail,
            student_ids: validation.data.student_ids ? validation.data.student_ids.split(',').map(id => Number(id.trim())) : [],
        }
        const response = await api.api.createApiV1LibraryPost(data)

        if (response.status === 201) {
            listLibrary() // Refresh the library list after creating a new library item
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function deleteLibraryItem(id: number): Promise<boolean> {
    try {
        const response = await api.api.deleteApiV1LibraryItemIdDelete(id)

        if (response.status === 204) {
            listLessons() // Refresh the schedules list after deleting a schedule
            return true
        }
        return false
    }   catch (error) {
        return false
    }

}

export async function listInvoices(): Promise<openApi.InvoiceRead[]> {
    try {
        const response = await api.api.listAllApiV1InvoicesGet()

        if (response.status === 200) {
            return response.data
        }
        return []
    } catch (error) {
        return []
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