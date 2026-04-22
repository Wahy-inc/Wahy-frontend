import * as openApi from "@/lib/openApi"
import { CreateInvoiceFormState, createInvoiceSchema, CreateLessonFormState, CreateLibraryItemFormState, createLibraryItemSchema, CreateScheduleFormState, createScheduleSchema, CreateStudentFormState, createStudentSchema, CreatLessonSchema, GetAttendanceAnalyticsFormState, getAttendanceAnalyticsSchema, GetAttendanceClassMEAnalyticsFormState, GetAttendanceMEAnalyticsFormState, getAttendanceMEAnalyticsSchema, GetAttendanceStudentAnalyticsFormState, getAttendanceStudentAnalyticsSchema, GetFinancialAnalyticsFormState, getFinancialAnalyticsSchema, GetInvoiceByIDFormState, GetLessonByDayFormState, GetLessonByIDFormState, getLessonHistoryState, GetLibraryItemByIDFormState, GetOperationalAnalyticsFormState, getOperationalAnalyticsSchema, GetPerformanceAnalyticsFormState, getPerformanceAnalyticsSchema, GetSchedualesForStudentFormState, GetStudentFormState, OverrideInvoiceFormState, overrideInvoiceSchema, PayInvoiceFormState, payInvoiceSchema, UpdateLessonFormState, UpdateLessonSchema, UpdateScheduleFormState, UpdateScheduleSchema, UpdateStudentFormState, updateStudentSchema } from "@/app/platform/lib/definitions"
import { createIdempotencyKey, enqueueOfflineMutation, isClientOnline, shouldQueueMutation } from "@/lib/offlineSync"
import { getCachedData, offlineCacheKeys, setCachedData } from "@/lib/offlineCache"
import { getApi } from "@/lib/apiClient"
import { DeleteClassFileResponseState, DownloadClassFileResponseState, ListUploadedClassFilesResponseState, uploadClassFileResponseState } from "../lib/definitionsv2"

const api = getApi()

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
        console.log(response);
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
            lessons_per_week: Number(validation.data.lessonsPerWeek),
            lesson_rate: Number(validation.data.lessonRate),
            billing_cycle: validation.data.billingCycle as openApi.BillingCycle,
            special_notes: validation.data.specialNotes,
            private_notes: validation.data.privateNotes,
        }
        console.log(data);

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'student',
                operation: openApi.SyncOperation.Create,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.createApiV1StudentsPost(data)

        if (response.status === 201) {
            listStudents() // Refresh the students list after creating a new student
            return { message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'student',
                operation: openApi.SyncOperation.Create,
                payload: {
                    user_id: Number(validation.data.id),
                    full_name_arabic: validation.data.arname,
                    full_name_english: validation.data.enname,
                    phone: validation.data.phone,
                    date_of_birth: validation.data.dateOfBirth,
                    timezone: validation.data.timeZone,
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
            status: validation.data.status as openApi.StudentStatus | undefined,
            lessons_per_week: Number(validation.data.lessonsPerWeek),
            lesson_rate: Number(validation.data.lessonRate),
            billing_cycle: validation.data.billingCycle as openApi.BillingCycle,
            special_notes: validation.data.specialNotes,
            private_notes: validation.data.privateNotes,
        }

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'student',
                entity_id: studentId,
                operation: openApi.SyncOperation.Update,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.updateApiV1StudentsStudentIdPatch(studentId, data)

        if (response.status === 200) {
            window.location.reload() // Refresh the students list after updating a student
            return { message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'student',
                entity_id: studentId,
                operation: openApi.SyncOperation.Update,
                payload: {
                    full_name_arabic: validation.data.arname,
                    full_name_english: validation.data.enname,
                    phone: validation.data.phone,
                    date_of_birth: validation.data.dateOfBirth,
                    timezone: validation.data.timeZone,
                    status: validation.data.status,
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

export async function approveStudent(id: number, note: openApi.StudentApprovalRequest): Promise<'success' | 'queued' | 'fail'> {
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
        void payload
        return 'fail'
    }
}

export async function rejectStudent(id: number, note: openApi.StudentApprovalRequest): Promise<'success' | 'queued' | 'fail'> {
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
        void payload
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
        student_id: formData.get('student_id'),
        start_time: formData.get('start-time'),
        end_time: formData.get('end-time'),
        effective_from: formData.get('effective-from'),
        effective_until: formData.get('effective-until'),
        rrule_string: formData.get('rrule_string'),
        notes: formData.get('notes'),
    })
    console.log("Validation result:", validation);

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data: openApi.ScheduleCreate = {
            student_id: Number(validation.data.student_id),
            start_time: validation.data.start_time,
            end_time: validation.data.end_time,
            effective_from: validation.data.effective_from,
            effective_until: validation.data.effective_until,
            rrule_string: validation.data.rrule_string,
            notes: validation.data.notes,
        }

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'schedule',
                operation: openApi.SyncOperation.Create,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.createApiV1SchedulesPost(data)

        if (response.status === 201) {
            return { message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'schedule',
                operation: openApi.SyncOperation.Create,
                payload: {
                    student_id: Number(validation.data.student_id),
                    start_time: validation.data.start_time,
                    end_time: validation.data.end_time,
                    effective_from: validation.data.effective_from,
                    effective_until: validation.data.effective_until,
                    rrule_string: validation.data.rrule_string,
                    notes: validation.data.notes,
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
        return { message: 'fail' }
    }
}

export async function updateSchedule(state: UpdateScheduleFormState, formData: FormData): Promise<UpdateScheduleFormState> {
    const scheduleId = Number(formData.get('schedule-id'))

    const validation = UpdateScheduleSchema.safeParse({
        start_time: formData.get('start-time'),
        end_time: formData.get('end-time'),
        effective_from: formData.get('effective-from'),
        effective_until: formData.get('effective-until'),
        rrule_string: formData.get('rrule_string'),
        is_active: formData.get('is-active'),
        cancellation_reason: formData.get('cancellation-reason'),
        notes: formData.get('notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data: openApi.ScheduleUpdate = {
            start_time: validation.data.start_time,
            end_time: validation.data.end_time,
            effective_from: validation.data.effective_from,
            effective_until: validation.data.effective_until,
            rrule_string: validation.data.rrule_string,
            is_active: validation.data.is_active === 'true',
            cancellation_reason: validation.data.cancellation_reason,
            notes: validation.data.notes,
        }

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'schedule',
                entity_id: scheduleId,
                operation: openApi.SyncOperation.Update,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.updateApiV1SchedulesScheduleIdPatch(scheduleId, data)

        if (response.status === 200) {
            window.location.reload() // Refresh the schedules list after updating a schedule
            return { message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'schedule',
                entity_id: scheduleId,
                operation: openApi.SyncOperation.Update,
                payload: {
                    start_time: validation.data.start_time,
                    end_time: validation.data.end_time,
                    effective_from: validation.data.effective_from,
                    effective_until: validation.data.effective_until,
                    rrule_string: validation.data.rrule_string,
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
        return { message: 'fail', error: { student_id: ['Student ID must be a number'] } }
    }
    if (formData.get('student-id') == '') {
        window.location.reload() // Refresh the page to show all schedules when student ID is cleared
        return { message: 'success' }
    }
    try {
        const response = await api.api.listForStudentApiV1SchedulesStudentStudentIdGet(studentId)

        if (response.status === 200) {
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
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
    } catch (error) {
        return false
    }
}

export async function listLessons(): Promise<openApi.ClassGroupItem[] | null> {
    try {
        const response = await api.api.listClassesApiV2ClassesGet()
        if (response.status === 200) {
            setCachedData(offlineCacheKeys.lessonsListAdmin, response.data)
            return response.data.classes
        }
        return null
    } catch (error) {
        const cacheKey = offlineCacheKeys.lessonsListAdmin
        const cached = getCachedData<openApi.ClassGroupItem[]>(cacheKey)
        if (cached) {
            return cached
        }
        return null
    }
}

export async function listLessonsMe(): Promise<openApi.ClassGroupItem[] | null> {
    try {
        const response = await api.api.listMyClassesApiV2ClassesMeGet()

        if (response.status === 200) {
            setCachedData(offlineCacheKeys.lessonsListMe, response.data)
            const results: openApi.ClassGroupItem[] = []
            for (const lesson of response.data.classes) {
                let isin = false;
                for (const res of results) {
                    if (res.schedule_id === lesson.schedule_id && res.day_label === lesson.day_label) {
                        isin = true
                        break
                    }
                }
                if (!isin) {
                    results.push(lesson)
                }
            }
            return results
        }
        return null
    } catch (error) {
        const cached = getCachedData<openApi.ClassGroupItem[]>(offlineCacheKeys.lessonsListMe)
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
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
        student_ids: formData.get('student_ids'),
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
            tags: validation.data.tags?.split(',').map(tag => tag.trim()) || [],
            access_level: validation.data.access_level,
            thumbnail_image_path: validation.data.thumbnail,
            student_ids: (validation.data.student_ids === '' || !validation.data.student_ids) 
                ? null 
                : validation.data.student_ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)) || null,
        }
        const response = await api.api.createApiV1LibraryPost(data)

        if (response.status === 201) {
            listLibrary() // Refresh the library list after creating a new library item
            return { message: 'success' }
        }
        return { message: 'fail' }
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
    } catch (error) {
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function createInvoices(state: CreateInvoiceFormState, formData: FormData): Promise<CreateInvoiceFormState> {
    const validation = createInvoiceSchema.safeParse({
        student_id: formData.get('student_id'),
        student_ids: formData.get('student_ids'),
        period_from: formData.get('period_from'),
        period_to: formData.get('period_to'),
        due_date: formData.get('due_date'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    try {
        const selectedIds = (validation.data.student_ids || validation.data.student_id || '')
            .split(',')
            .map((value) => Number(value.trim()))
            .filter((value) => !Number.isNaN(value))
            const uniqueIds = Array.from(new Set(selectedIds))
            if (uniqueIds.length === 0) {
                return { error: { student_id: ['At least one student is required'] } }
            }
            
            const data: openApi.InvoiceGenerateRequest = {
                student_id: Number(validation.data.student_id),
                student_ids: selectedIds,
                period_from: validation.data.period_from,
                period_to: validation.data.period_to,
                due_date: validation.data.due_date,
            }
        const response = await api.api.generateApiV1InvoicesGeneratePost(data)

        if (response.status === 200) {
            return { message: 'success' }
        }
        return { message: 'fail' }
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
        return { message: 'faile' }
    }

    try {
        const invoiceId = Number(validation.data.invoice_id)
        const data: openApi.InvoiceItemOverrideRequest = {
            item_id: Number(validation.data.invoice_id),
            billable: validation.data.billable.toLowerCase() === 'yes',
            override_reason: validation.data.override_reason,
        }
        const response = await api.api.overrideItemApiV1InvoicesInvoiceIdOverridesPost(invoiceId, data)

        if (response.status === 200) {
            window.location.reload() // Refresh the invoices list after overriding an invoice item
            return { message: 'success' }
        }
        return { message: 'fail' }
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
            window.location.reload() // Refresh the invoices list after marking an invoice as paid
            return { message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function createLesson(state: CreateLessonFormState, formData: FormData): Promise<CreateLessonFormState> {
    const validation = CreatLessonSchema.safeParse({
        student_id: formData.get('student_id'),
        sheikh_notes: formData.get('sheikh_notes'),
        student_notes: formData.get('student_notes'),
        date: formData.get('date'),
        type: formData.get('type'),
        attendance: formData.get('attendance'),
        absence_reason: formData.get('absence_reason'),
        what_is_heard_from_sheikh: formData.get('what_is_heard_from_sheikh'),
        homework: formData.get('homework'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data: openApi.LessonCreate = {
            student_id: Number(validation.data.student_id),
            date: validation.data.date,
            type: validation.data.type,
            attendance: validation.data.attendance,
            absence_reason: validation.data.absence_reason,
            student_notes: validation.data.student_notes,
            sheikh_notes: validation.data.sheikh_notes,
            what_is_heard_from_sheikh: validation.data.what_is_heard_from_sheikh,
            homework: validation.data.homework,
        }

        console.log('Created lesson data:', data);
        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'lesson',
                operation: openApi.SyncOperation.Create,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.createApiV1LessonsPost(data)

        if (response.status === 201) {
            console.log('created lesson');
            return { message: 'success' }
        }
        if (response.status === 422) {
            return { message: 'fail' }
        }
        return { message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'lesson',
                operation: openApi.SyncOperation.Create,
                payload: {
                    student_id: Number(validation.data.student_id),
                    date: validation.data.date,
                    type: validation.data.type,
                    attendance: validation.data.attendance,
                    absence_reason: validation.data.absence_reason,
                    student_notes: validation.data.student_notes,
                    sheikh_notes: validation.data.sheikh_notes,
                    what_is_heard_from_sheikh: validation.data.what_is_heard_from_sheikh,
                    homework: validation.data.homework,
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
        return { message: 'fail' }
    }
}

export async function updateLesson(state: UpdateLessonFormState, formData: FormData): Promise<UpdateLessonFormState> {
    const validation = UpdateLessonSchema.safeParse({
        id: formData.get('lesson-id'),
        sheikh_notes: formData.get('sheikh_notes'),
        student_notes: formData.get('student_notes'),
        date: formData.get('date'),
        type: formData.get('type'),
        attendance: formData.get('attendance'),
        absence_reason: formData.get('absence_reason'),
        what_is_heard_from_sheikh: formData.get('what_is_heard_from_sheikh'),
        homework: formData.get('homework'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }
    try {
        const data: openApi.LessonUpdate = {
            date: validation.data.date,
            type: validation.data.type,
            attendance: validation.data.attendance,
            absence_reason: validation.data.absence_reason,
            student_notes: validation.data.student_notes,
            sheikh_notes: validation.data.sheikh_notes,
            what_is_heard_from_sheikh: validation.data.what_is_heard_from_sheikh,
            homework: validation.data.homework,
        }

        if (!isClientOnline()) {
            enqueueOfflineMutation({
                entity_type: 'lesson',
                entity_id: Number(validation.data.id),
                operation: openApi.SyncOperation.Update,
                payload: data as unknown as Record<string, unknown>,
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }

        const response = await api.api.updateApiV1LessonsLessonIdPatch(Number(validation.data.id), data)

        if (response.status === 200) {
            window.location.reload() // Refresh the lessons list after creating a new lesson
            return { message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        if (shouldQueueMutation(error)) {
            enqueueOfflineMutation({
                entity_type: 'lesson',
                entity_id: Number(validation.data.id),
                operation: openApi.SyncOperation.Update,
                payload: {
                    date: validation.data.date,
                    type: validation.data.type,
                    attendance: validation.data.attendance,
                    absence_reason: validation.data.absence_reason,
                    student_notes: validation.data.student_notes,
                    sheikh_notes: validation.data.sheikh_notes,
                    what_is_heard_from_sheikh: validation.data.what_is_heard_from_sheikh,
                    homework: validation.data.homework,
                },
                idempotency_key: createIdempotencyKey(),
            })
            return { message: 'queued' }
        }
        return { message: 'fail' }
    }
}

export async function getLessonByDay(state: GetLessonByDayFormState, formData: FormData): Promise<GetLessonByDayFormState> {
    const lessonDay = formData.get('lesson-day')
    try {
        const response = await api.api.listClassesApiV2ClassesGet()

        if (response.status === 200) {
            const lessons = response.data.classes.filter((lesson: openApi.ClassGroupItem) => lesson.day_label === lessonDay)
            return { message: 'success', data: lessons }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function getLessonHistory(state: getLessonHistoryState, scheduleID: number): Promise<getLessonHistoryState> {
    try {
        const response = await api.api.getHistoryApiV2ClassesScheduleIdHistoryGet(scheduleID)

        if (response.status === 200) {
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function getMeMyLessonHistory(state: getLessonHistoryState, scheduleID: number): Promise<getLessonHistoryState> {
    try {
        const response = await api.api.getMyHistoryApiV2ClassesMeScheduleIdHistoryGet(scheduleID)

        if (response.status === 200) {
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function getLessonByDayMe(state: GetLessonByDayFormState, formData: FormData): Promise<GetLessonByDayFormState> {
    const lessonDay = formData.get('lesson-day')
    try {
        const response = await api.api.listMyClassesApiV2ClassesMeGet()

        if (response.status === 200) {
            const lessons = response.data.classes.filter((lesson: openApi.ClassGroupItem) => lesson.day_label == lessonDay)
            return { message: 'success', data: lessons }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function uploadClassFile(state: uploadClassFileResponseState, formData: FormData): Promise<uploadClassFileResponseState> {
    const scheduleId = Number(formData.get('schedule_id'))
    const file = formData.get('file') as File
    
    if (!file) {
        return { message: 'fail'}
    }
    
    const data: openApi.BodyUploadClassFileApiV2ClassFilesScheduleIdFilesPost = {
        file: file,
    }
    try {
        const response = await api.api.uploadClassFileApiV2ClassFilesScheduleIdFilesPost(scheduleId, data)
        if (response.status === 201) {
            return { message: 'success' , data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function listUploadClassFile(scheduleId: number): Promise<ListUploadedClassFilesResponseState> {
    try {
        const response = await api.api.listClassFilesApiV2ClassFilesScheduleIdFilesGet(scheduleId)
        if (response.status === 200) {
            return { message: 'success' , data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function listMyUploadClassFile(scheduleId: number): Promise<ListUploadedClassFilesResponseState> {
    try {
        const response = await api.api.listMyClassFilesApiV2ClassFilesMeScheduleIdFilesGet(scheduleId)
        if (response.status === 200) {
            return { message: 'success' , data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function downloadClassFile(scheduleId: number, fileId: number): Promise<boolean> {
    try {
        const response = await api.api.downloadClassFileApiV2ClassFilesScheduleIdFilesFileIdGet(scheduleId, fileId)
        if (response.status === 200) {
            // Handle response.data as binary blob to prevent file corruption
            const blob = response.data instanceof Blob ? response.data : new Blob([response.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `classfile_${fileId}`)
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

export async function deleteClassFile(scheduleId: number, fileId: number): Promise<DeleteClassFileResponseState> {
    try {
        const response = await api.api.deleteClassFileApiV2ClassFilesScheduleIdFilesFileIdDelete(scheduleId, fileId)
        if (response.status === 204) {
            window.location.reload()
            return { message: 'success' }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function attendanceAnalytics(state: GetAttendanceAnalyticsFormState, formData: FormData): Promise<GetAttendanceAnalyticsFormState> {
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function attendanceMEAnalytics(state: GetAttendanceMEAnalyticsFormState, formData: FormData): Promise<GetAttendanceMEAnalyticsFormState> {
    const validation = getAttendanceMEAnalyticsSchema.safeParse({
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
        const response = await api.api.getMyAttendanceHoursApiV1StudentsMeAttendanceHoursGet(data)

        if (response.status === 200) {
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function attendanceClassMEAnalytics(state: GetAttendanceClassMEAnalyticsFormState, formData: FormData): Promise<GetAttendanceClassMEAnalyticsFormState> {
    const validation = getAttendanceMEAnalyticsSchema.safeParse({
        period_start: formData.get('period_start'),
        period_end: formData.get('period_end'),
    })
    const scheduleId = Number(formData.get('schedule_id'))

    if (!validation.success) {
        console.log('succeded');
        return { message: 'fail' }
    }
    try {
        const data = {
            start_date: validation.data.period_start,
            end_date: validation.data.period_end,
        }
        const response = await api.api.getMyAttendanceApiV2ClassesMeScheduleIdAttendanceGet(scheduleId, data)

        if (response.status === 200) {
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function attendanceClassAnalytics(state: GetAttendanceClassMEAnalyticsFormState, formData: FormData): Promise<GetAttendanceClassMEAnalyticsFormState> {
    const validation = getAttendanceMEAnalyticsSchema.safeParse({
        period_start: formData.get('period_start'),
        period_end: formData.get('period_end'),
    })
    const scheduleId = Number(formData.get('schedule_id'))

    if (!validation.success) {
        console.log('succeded');
        return { message: 'fail' }
    }
    try {
        const data = {
            start_date: validation.data.period_start,
            end_date: validation.data.period_end,
        }
        const response = await api.api.getAttendanceApiV2ClassesScheduleIdAttendanceGet(scheduleId, data)

        if (response.status === 200) {
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function attendanceStudentAnalytics(state: GetAttendanceStudentAnalyticsFormState, formData: FormData): Promise<GetAttendanceStudentAnalyticsFormState> {
    const validation = getAttendanceStudentAnalyticsSchema.safeParse({
        student_id: formData.get('student_id'),
        period_start: formData.get('period_start'),
        period_end: formData.get('period_end'),
    })

    if (!validation.success) {
        return { message: 'fail' }
    }
    try {
        const studentId = Number(validation.data.student_id)
        const response = await api.api.getStudentAttendanceHoursApiV1StudentsStudentIdAttendanceHoursGet(studentId, {
            start_date: validation.data.period_start,
            end_date: validation.data.period_end,
        })

        if (response.status === 200) {
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function financialAnalytics(state: GetFinancialAnalyticsFormState, formData: FormData): Promise<GetFinancialAnalyticsFormState> {
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function performanceAnalytics(state: GetPerformanceAnalyticsFormState, formData: FormData): Promise<GetPerformanceAnalyticsFormState> {
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}

export async function operationalAnalytics(state: GetOperationalAnalyticsFormState, formData: FormData): Promise<GetOperationalAnalyticsFormState> {
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
            return { message: 'success', data: response.data }
        }
        return { message: 'fail' }
    } catch (error) {
        return { message: 'fail' }
    }
}