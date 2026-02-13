import * as openApi from "@/lib/openApi"
import { CreateInvoiceFormState, createInvoiceSchema, CreateLessonFormState, CreateLibraryItemFormState, createLibraryItemSchema, CreateScheduleFormState, createScheduleSchema, CreateStudentFormState, createStudentSchema, CreatLessonSchema, GetAttendanceAnalyticsFormState, getAttendanceAnalyticsSchema, GetFinancialAnalyticsFormState, getFinancialAnalyticsSchema, GetInvoiceByIDFormState, GetLessonByIDFormState, GetLibraryItemByIDFormState, GetOperationalAnalyticsFormState, getOperationalAnalyticsSchema, GetPerformanceAnalyticsFormState, getPerformanceAnalyticsSchema, GetSchedualesForStudentFormState, GetStudentFormState, OverrideInvoiceFormState, overrideInvoiceSchema, PayInvoiceFormState, payInvoiceSchema, UpdateLessonFormState, UpdateLessonSchema, UpdateScheduleFormState, UpdateScheduleSchema, UpdateStudentFormState, updateStudentSchema } from "@/app/platform/lib/definitions"
import { createIdempotencyKey, enqueueOfflineMutation, isClientOnline, shouldQueueMutation } from "@/lib/offlineSync"
import { getCachedData, offlineCacheKeys, setCachedData } from "@/lib/offlineCache"

const api = new openApi.Api({
    baseUrl: '',
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

export async function getStudentMe(): Promise<openApi.StudentSelfRead | null> {
    try {
        const response = await api.api.getMeApiV1StudentsMeGet()
        if (response.status === 200) {
            setCachedData(offlineCacheKeys.studentProfileMe, response.data)
            return response.data
        }
        return null
    } catch (error) {
        const cached = getCachedData<openApi.StudentSelfRead>(offlineCacheKeys.studentProfileMe)
        if (cached) {
            return cached
        }
        return null
    }
}

export async function listStudents(): Promise<openApi.StudentRead[] | null> {
    try {
        const response = await api.api.listAllApiV1StudentsGet()

        if (response.status === 200) {
            setCachedData(offlineCacheKeys.studentsList, response.data)
            const Students = response.data.map((student) => {
                return {
                    student_id: student.id,
                    full_name_arabic: student.full_name_arabic,
                    full_name_english: student.full_name_english,
                }
            })
            localStorage.setItem('students', JSON.stringify(Students))
            return response.data
        }
        return null
    } catch (error) {
        const cached = getCachedData<openApi.StudentRead[]>(offlineCacheKeys.studentsList)
        if (cached) {
            return cached
        }
        return null
    }
}

export function getLocalStudent(id: number) {
    if (typeof window === 'undefined') return null
    const students = localStorage.getItem('students')
    if (students) {
        const studentsArray = JSON.parse(students)
        return studentsArray.find((student: { student_id: number, full_name_arabic: string, full_name_english: string }) => {
            if (student.student_id === id) {
                const data = {
                    full_name_arabic: student.full_name_arabic,
                    full_name_english: student.full_name_english,
                }
                return data
            }
        }) || null
    }
    return null
}

export async function createStudent(state: CreateStudentFormState, formData: FormData): Promise<CreateStudentFormState> {
    const validation = createStudentSchema.safeParse({
        id: formData.get('id'),
        arname: formData.get('ar-name'),
        enname: formData.get('en-name'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        timeZone: formData.get('timeZone'),
        currjuz: formData.get('currjuz'),
        currsurah: formData.get('currsurah'),
        currayah: formData.get('currayah'),
        lessonsPerWeek: formData.get('lessonsPerWeek'),
        lessonRate: formData.get('lessonRate'),
        billingCycle: formData.get('billingCycle'),
        specialNotes: formData.get('specialNotes'),
        privateNotes: formData.get('privateNotes'),
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
            billing_cycle: validation.data.billingCycle as openApi.BillingCycle,
            special_notes: validation.data.specialNotes,
            private_notes: validation.data.privateNotes,
        }

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'students',
                operation: openApi.SyncOperation.Create,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.createApiV1StudentsPost(data)

        if (response.status === 201) {
            listStudents() // Refresh the students list after creating a new student
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'students',
                operation: openApi.SyncOperation.Create,
                payload: {
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
                    billing_cycle: validation.data.billingCycle,
                    special_notes: validation.data.specialNotes,
                    private_notes: validation.data.privateNotes,
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
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
            billing_cycle: validation.data.billingCycle as openApi.BillingCycle,
            special_notes: validation.data.specialNotes,
            private_notes: validation.data.privateNotes,
        }

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'students',
                entity_id: studentId,
                operation: openApi.SyncOperation.Update,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.updateApiV1StudentsStudentIdPatch(studentId, data)

        if (response.status === 200) {
            listStudents() // Refresh the students list after updating a student
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'students',
                entity_id: studentId,
                operation: openApi.SyncOperation.Update,
                payload: {
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
                    billing_cycle: validation.data.billingCycle,
                    special_notes: validation.data.specialNotes,
                    private_notes: validation.data.privateNotes,
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
        return { message: 'fail' }
    }
}

export async function approveStudent(id:number, note: openApi.StudentApprovalRequest): Promise<'success' | 'queued' | 'fail'> {
    const studentId = Number(id)
    if (isNaN(studentId)) {
        return 'fail'
    }

    const payload = {
        action: 'approve',
        notes: note.notes ?? null,
    }

    try {
        const response = await api.api.approveApiV1StudentsStudentIdApprovePost(id, note)
        if (response.status === 200) {
            window.location.reload() // Refresh the page after approving a student
            return 'success'
        }
        return 'fail'
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'students_approval',
                entity_id: studentId,
                operation: openApi.SyncOperation.Update,
                payload,
                idempotency_key: createIdempotencyKey(),
            })
            return 'queued'
        }
        return 'fail'
    }
}

export async function rejectStudent(id:number, note: openApi.StudentApprovalRequest): Promise<'success' | 'queued' | 'fail'> {
    const studentId = Number(id)
    if (isNaN(studentId)) {
        return 'fail'
    }

    const payload = {
        action: 'reject',
        notes: note.notes ?? null,
    }

    try {
        const response = await api.api.rejectApiV1StudentsStudentIdRejectPost(id, note)
        if (response.status === 200) {
            window.location.reload() // Refresh the page after rejecting a student
            return 'success'
        }
        return 'fail'
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'students_approval',
                entity_id: studentId,
                operation: openApi.SyncOperation.Update,
                payload,
                idempotency_key: createIdempotencyKey(),
            })
            return 'queued'
        }
        return 'fail'
    }
}

export async function listSchedules(): Promise<openApi.ScheduleRead[] | null> {
    try {
        const response = await api.api.listAllApiV1SchedulesGet()

        if (response.status === 200) {
            setCachedData(offlineCacheKeys.schedulesListAdmin, response.data)
            return response.data
        }
        return null
    } catch (error) {
        const cached = getCachedData<openApi.ScheduleRead[]>(offlineCacheKeys.schedulesListAdmin)
        if (cached) {
            return cached
        }
        return null
    }
}

export async function listSchedulesMe(): Promise<openApi.ScheduleRead[] | null> {
    try {
        const response = await api.api.listMyScheduleApiV1SchedulesMeGet()

        if (response.status === 200) {
            setCachedData(offlineCacheKeys.schedulesListMe, response.data)
            return response.data
        }
        return null
    } catch (error) {
        const cached = getCachedData<openApi.ScheduleRead[]>(offlineCacheKeys.schedulesListMe)
        if (cached) {
            return cached
        }
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

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'schedules',
                operation: openApi.SyncOperation.Create,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.createApiV1SchedulesPost(data)

        if (response.status === 201) {
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'schedules',
                operation: openApi.SyncOperation.Create,
                payload: {
                    student_id: Number(validation.data.student_id),
                    day_of_week: Number(validation.data.day_of_week),
                    start_time: validation.data.start_time,
                    end_time: validation.data.end_time,
                    effective_from: validation.data.effective_from,
                    effective_until: validation.data.effective_until,
                    is_recurring: validation.data.is_recurring === 'true',
                    notes: validation.data.notes,
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
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

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'schedules',
                entity_id: scheduleId,
                operation: openApi.SyncOperation.Update,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.updateApiV1SchedulesScheduleIdPatch(scheduleId, data)

        if (response.status === 200) {
            listSchedules() // Refresh the schedules list after updating a schedule
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'schedules',
                entity_id: scheduleId,
                operation: openApi.SyncOperation.Update,
                payload: {
                    day_of_week: Number(validation.data.day_of_week),
                    start_time: validation.data.start_time,
                    end_time: validation.data.end_time,
                    effective_from: validation.data.effective_from,
                    effective_until: validation.data.effective_until,
                    is_recurring: validation.data.is_recurring === 'true',
                    is_active: validation.data.is_active === 'true',
                    cancellation_reason: validation.data.cancellation_reason,
                    notes: validation.data.notes,
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
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
            window.location.reload() // Refresh the page after deleting a schedule
            return true
        }
        return false
    }   catch (error) {
        return false
    }
}

export async function listLessons(stu_id:number | null = null): Promise<openApi.LessonRead[] | null> {
    try {
        const response = await api.api.listAllApiV1LessonsGet(stu_id? {student_id: stu_id} : {student_id: undefined})

        if (response.status === 200) {
            if (stu_id === null) {
                setCachedData(offlineCacheKeys.lessonsListAdmin, response.data)
            } else {
                setCachedData(offlineCacheKeys.lessonsListByStudent(stu_id), response.data)
            }
            return response.data
        }
        return null
    } catch (error) {
        const cacheKey = stu_id === null ? offlineCacheKeys.lessonsListAdmin : offlineCacheKeys.lessonsListByStudent(stu_id)
        const cached = getCachedData<openApi.LessonRead[]>(cacheKey)
        if (cached) {
            return cached
        }
        return null
    }
}

export async function listLessonsMe(): Promise<openApi.LessonRead[] | null> {
    try {
        const response = await api.api.listMyLessonsApiV1LessonsMeGet()

        if (response.status === 200) {
            setCachedData(offlineCacheKeys.lessonsListMe, response.data)
            return response.data
        }
        return null
    } catch (error) {
        const cached = getCachedData<openApi.LessonRead[]>(offlineCacheKeys.lessonsListMe)
        if (cached) {
            return cached
        }
        return null
    }
}

export async function listLibrary(): Promise<openApi.LibraryItemRead[] | null> {
    try {
        const response = await api.api.listAllApiV1LibraryGet()

        if (response.status === 200) {
            setCachedData(offlineCacheKeys.libraryListAdmin, response.data)
            return response.data
        }
        return null
    } catch (error) {
        const cached = getCachedData<openApi.LibraryItemRead[]>(offlineCacheKeys.libraryListAdmin)
        if (cached) {
            return cached
        }
        return null
    }
}

export async function listLibraryMe(): Promise<openApi.LibraryItemRead[] | null> {
    try {
        const response = await api.api.listMyLibraryApiV1LibraryMeGet()

        if (response.status === 200) {
            setCachedData(offlineCacheKeys.libraryListMe, response.data)
            return response.data
        }
        return null
    } catch (error) {
        const cached = getCachedData<openApi.LibraryItemRead[]>(offlineCacheKeys.libraryListMe)
        if (cached) {
            return cached
        }
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

export async function getLibraryItemMe(state: GetLibraryItemByIDFormState, formData: FormData): Promise<GetLibraryItemByIDFormState> {
    const id = Number(formData.get('item-id'))
    if (isNaN(id)) {
        return { error: { item_id: ['Item ID must be a number'] } }
    }
    try {
        const response = await api.api.getMyItemApiV1LibraryMeItemIdGet(id)

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
            student_ids: validation.data.student_ids,
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
            window.location.reload() // Refresh the page after deleting a library item
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
            setCachedData(offlineCacheKeys.invoicesListAdmin, response.data)
            return response.data
        }
        return []
    } catch (error) {
        const cached = getCachedData<openApi.InvoiceRead[]>(offlineCacheKeys.invoicesListAdmin)
        if (cached) {
            return cached
        }
        return []
    }
}

export async function listInvoicesMe(): Promise<openApi.InvoiceRead[]> {
    try {
        const response = await api.api.listMyInvoicesApiV1InvoicesMeGet()

        if (response.status === 200) {
            setCachedData(offlineCacheKeys.invoicesListMe, response.data)
            return response.data
        }
        return []
    } catch (error) {
        const cached = getCachedData<openApi.InvoiceRead[]>(offlineCacheKeys.invoicesListMe)
        if (cached) {
            return cached
        }
        return []
    }
}

export async function getInvoice(state: GetInvoiceByIDFormState, formData: FormData): Promise<GetInvoiceByIDFormState> {
    const id = Number(formData.get('invoice_id'))
    if (isNaN(id)) {
        return { error: { invoice_id: ['Invoice ID must be a number'] } }
    }
    try {
        const response = await api.api.getOneApiV1InvoicesInvoiceIdGet(id)

        if (response.status === 200) {
            return {message: 'success', data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return {message: 'fail' }
    }
}

export async function getInvoiceMe(state: GetInvoiceByIDFormState, formData: FormData): Promise<GetInvoiceByIDFormState> {
    const id = Number(formData.get('invoice_id'))
    if (isNaN(id)) {
        return { error: { invoice_id: ['Invoice ID must be a number'] } }
    }
    try {
        const response = await api.api.getMyInvoiceApiV1InvoicesMeInvoiceIdGet(id)

        if (response.status === 200) {
            return {message: 'success', data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return {message: 'fail' }
    }
}

export async function createInvoices(state: CreateInvoiceFormState, formData: FormData): Promise<CreateInvoiceFormState> {
    const validation = createInvoiceSchema.safeParse({
        student_id: formData.get('student_id'),
        period_from: formData.get('period_from'),
        period_to: formData.get('period_to'),
        due_date: formData.get('due_date'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    try {
        const data: openApi.InvoiceGenerateRequest = {
            student_id: Number(validation.data.student_id),
            period_from: validation.data.period_from,
            period_to: validation.data.period_to,
            due_date: validation.data.due_date,
        }
        const response = await api.api.generateApiV1InvoicesGeneratePost(data)

        if (response.status === 201) {
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function overrideInvoice(state: OverrideInvoiceFormState, formData: FormData): Promise<OverrideInvoiceFormState> {
    const validation = overrideInvoiceSchema.safeParse({
        invoice_id: formData.get('invoice_id'),
        billable: formData.get('billable'),
        override_reason: formData.get('override_reason'),
    })

    if (!validation.success) {
        console.log('override invoice Validation failed:', validation.error.flatten().fieldErrors);
        return {message: 'faile'}
    }

    try {
        const data: openApi.InvoiceItemOverrideRequest = {
            item_id: validation.data.invoice_id,
            billable: validation.data.billable === 'true',
            override_reason: validation.data.override_reason,
        }
        const id = Number(validation.data.invoice_id)
        const response = await api.api.overrideItemApiV1InvoicesInvoiceIdOverridesPost(id, data)

        if (response.status === 200) {
            listInvoices() // Refresh the invoices list after overriding an invoice item
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function downloadInvoicePDF(id: number): Promise<boolean> {
    try {
        const response = await api.api.getPdfApiV1InvoicesInvoiceIdPdfGet(id)

        if (response.status === 200) {
            // Handle response.data as binary blob to prevent PDF corruption
            const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `invoice_${id}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

export async function downloadInvoicePDFMe(id: number): Promise<boolean> {
    try {
        const response = await api.api.getMyPdfApiV1InvoicesMeInvoiceIdPdfGet(id)

        if (response.status === 200) {
            // Handle response.data as binary blob to prevent PDF corruption
            const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: 'application/pdf' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `invoice_${id}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

export async function markInvoiceAsPaid(state: PayInvoiceFormState, formData: FormData): Promise<PayInvoiceFormState> {
    const validation = payInvoiceSchema.safeParse({
        invoice_id: formData.get('invoice_id'),
        paid_date: formData.get('paid_date'),
        payment_method: formData.get('payment_method'),
        payment_reference: formData.get('payment_reference'),
        payment_notes: formData.get('payment_notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    try {
        const id = Number(validation.data.invoice_id)
        const data: openApi.InvoicePaidRequest = {
            paid_date: validation.data.paid_date,
            payment_method: validation.data.payment_method,
            payment_reference: validation.data.payment_reference,
            payment_notes: validation.data.payment_notes,
        }
        const response = await api.api.markInvoicePaidApiV1InvoicesInvoiceIdPaidPatch(id, data)

        if (response.status === 200) {
            listInvoices() // Refresh the invoices list after marking an invoice as paid
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function createLesson(state: CreateLessonFormState, formData: FormData): Promise<CreateLessonFormState> {
    const validation = CreatLessonSchema.safeParse({
        student_id: formData.get('student_id'),
        schedule_id: formData.get('schedule_id'),
        sheikh_notes: formData.get('sheikh_notes'),
        student_notes: formData.get('student_notes'),
        date: formData.get('date'),
        type: formData.get('type'),
        attendance: formData.get('attendance'),
        juz: formData.get('juz'),
        surah: formData.get('surah'),
        ayah_from: formData.get('ayah_from'),
        ayah_to: formData.get('ayah_to'),
        quality: formData.get('quality'),
        attempts: formData.get('attempts'),
        absence_reason: formData.get('absence_reason'),
        pass_fail: formData.get('pass_fail'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data:openApi.LessonCreate = {
        student_id: String(validation.data.student_id),
        schedule_id: String(validation.data.schedule_id),
        sheikh_notes: validation.data.sheikh_notes,
        student_notes: validation.data.student_notes,
        date: validation.data.date,
        type: validation.data.type,
        attendance: validation.data.attendance,
        juz_number: String(validation.data.juz),
        surah_name: validation.data.surah,
        ayah_from: String(validation.data.ayah_from),
        ayah_to: String(validation.data.ayah_to),
        quality: validation.data.quality,
        attempts: String(validation.data.attempts),
        absence_reason: validation.data.absence_reason,
        pass_fail: validation.data.pass_fail === 'true'? true : false,
        }

        console.log('Created lesson data:', data);
        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'lessons',
                operation: openApi.SyncOperation.Create,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.createApiV1LessonsPost(data)

        if (response.status === 201) {
            console.log('created lesson');
            return {message: 'success' }
        }
        if (response.status === 422) {
            return {message: 'fail'}
        }
        return {message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'lessons',
                operation: openApi.SyncOperation.Create,
                payload: {
                    student_id: String(validation.data.student_id),
                    schedule_id: String(validation.data.schedule_id),
                    sheikh_notes: validation.data.sheikh_notes,
                    student_notes: validation.data.student_notes,
                    date: validation.data.date,
                    type: validation.data.type,
                    attendance: validation.data.attendance,
                    juz_number: String(validation.data.juz),
                    surah_name: validation.data.surah,
                    ayah_from: String(validation.data.ayah_from),
                    ayah_to: String(validation.data.ayah_to),
                    quality: validation.data.quality,
                    attempts: String(validation.data.attempts),
                    absence_reason: validation.data.absence_reason,
                    pass_fail: validation.data.pass_fail === 'true' ? true : false,
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
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
        absence_reason: validation.data.absence_reason
        }

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'lessons',
                entity_id: lessonId,
                operation: openApi.SyncOperation.Update,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.updateApiV1LessonsLessonIdPatch(lessonId, data)

        if (response.status === 200) {
            listLessons() // Refresh the lessons list after creating a new lesson
            return {message: 'success' }
        }
        return {message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'lessons',
                entity_id: lessonId,
                operation: openApi.SyncOperation.Update,
                payload: {
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
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
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

export async function getLessonByIDMe(state:GetLessonByIDFormState, formData: FormData): Promise<GetLessonByIDFormState> {
    const lessonId = Number(formData.get('lesson-id'))
    if (isNaN(lessonId)) {
        return { error: { lesson_id: ['Lesson ID must be a number'] } }
    }
    try {
        const response = await api.api.getMyLessonApiV1LessonsMeLessonIdGet(lessonId)

        if (response.status === 200) {
            return {message: 'success' , data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function attendanceAnalytics(state:GetAttendanceAnalyticsFormState, formData: FormData): Promise<GetAttendanceAnalyticsFormState> {
    const validation = getAttendanceAnalyticsSchema.safeParse({
        period_start: formData.get('period_start'),
        period_end: formData.get('period_end'),
    })

    if (!validation.success) {
        console.log('succeded');
        return { message: 'fail' }
    }
    try {
        const data = {
            start_date: validation.data.period_start,
            end_date: validation.data.period_end,
        }
        const response = await api.api.attendanceApiV1AnalyticsAttendanceGet(data)

        if (response.status === 200) {
            return {message: 'success' , data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function financialAnalytics(state:GetFinancialAnalyticsFormState, formData: FormData): Promise<GetFinancialAnalyticsFormState> {
    const validation = getFinancialAnalyticsSchema.safeParse({
        period_start: formData.get('period_start'),
        period_end: formData.get('period_end'),
    })

    if (!validation.success) {
        return { message: 'fail' }
    }
    try {
        const data = {
            start_date: validation.data.period_start,
            end_date: validation.data.period_end,
        }
        const response = await api.api.financialApiV1AnalyticsFinancialGet(data)

        if (response.status === 200) {
            return {message: 'success' , data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function performanceAnalytics(state:GetPerformanceAnalyticsFormState, formData: FormData): Promise<GetPerformanceAnalyticsFormState> {
    const validation = getPerformanceAnalyticsSchema.safeParse({
        period_start: formData.get('period_start'),
        period_end: formData.get('period_end'),
    })

    if (!validation.success) {
        return { message: 'fail' }
    }
    try {
        const data = {
            start_date: validation.data.period_start,
            end_date: validation.data.period_end,
        }
        const response = await api.api.performanceApiV1AnalyticsPerformanceGet(data)

        if (response.status === 200) {
            return {message: 'success' , data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function operationalAnalytics(state:GetOperationalAnalyticsFormState, formData: FormData): Promise<GetOperationalAnalyticsFormState> {
    const validation = getOperationalAnalyticsSchema.safeParse({
        period_start: formData.get('period_start'),
        period_end: formData.get('period_end'),
    })

    if (!validation.success) {
        return { message: 'fail' }
    }
    try {
        const data = {
            start_date: validation.data.period_start,
            end_date: validation.data.period_end,
        }
        const response = await api.api.operationalApiV1AnalyticsOperationalGet(data)

        if (response.status === 200) {
            return {message: 'success' , data: response.data }
        }
        return {message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}