import { AttendanceStatus, LessonQuality, LessonType } from '@/lib/openApi';
import * as zod from 'zod';
import * as openApi from "@/lib/openApi";

export const SignUpSchema = zod.object({
    arname: zod.string().min(1, { error: 'Name is required' }).trim(),
    enname: zod.string().min(1, { error: 'Name is required' }).trim(),
    email: zod.email({ error: 'Invalid email address' }).trim(),
    password: zod.string().min(6, { error: 'Password must be at least 6 characters long' })
        .regex(/[a-zA-Z]/, { error: 'Password must contain at least one letter' })
        .regex(/[0-9]/, { error: 'Password must contain at least one number' }).trim(),
    phone: zod.string().min(1, { error: 'Phone number is required' }).trim(),
    dateOfBirth: zod.string().min(1, { error: 'Date of birth is required' }).trim(),
    timeZone: zod.string().min(1, { error: 'Time zone is required' }).trim(),
    currjuz: zod.string().min(1, { error: 'Current Juz is required' }).trim(),
    currsurah: zod.string().min(1, { error: 'Current Surah is required' }).trim(),
    currayah: zod.string().min(1, { error: 'Current Ayah is required' }).trim(),
    lessonsPerWeek: zod.string().min(1, { error: 'Lessons per week is required' }).trim(),
    lessonRate: zod.string().min(1, { error: 'Lesson rate is required' }).trim(),
    billingCycle: zod.enum(openApi.BillingCycle, { error: 'Invalid billing cycle' }),
    specialNotes: zod.string().min(0, { error: 'Special notes is required' }).trim(),
})

export type SignupFormState =
    | {
        error?: {
            arname?: string[];
            enname?: string[];
            email?: string[];
            password?: string[];
            phone?: string[];
            dateOfBirth?: string[];
            timeZone?: string[];
            currjuz?: string[];
            currsurah?: string[];
            currayah?: string[];
            lessonsPerWeek?: string[];
            lessonRate?: string[];
            billingCycle?: string[];
            specialNotes?: string[];
        }
        message?: string;
    }
    | undefined;

export const SignInSchema = zod.object({
    email: zod.string().email({ error: 'Invalid email address' }).trim(),
    password: zod.string().min(6, { error: 'Password invalid' }).trim(),
})

export type SignInFormState =
    | {
        error?: {
            email?: string[];
            password?: string[];
        }
        message?: string;
    }
    | undefined;

export const CreatLessonSchema = zod.object({
    student_id: zod.string().min(1, { error: 'Student ID is required' }),
    date: zod.string().min(1, { error: 'Date is required' }).trim(),
    type: zod.enum(LessonType, { error: 'Invalid lesson type' }),
    attendance: zod.enum(AttendanceStatus, { error: 'Invalid attendance status' }),
    juz: zod.string({ error: 'Juz must be a number' }).min(1, { error: 'Juz is required' }),
    surah: zod.string().min(1, { error: 'Surah is required' }).trim(),
    ayah_from: zod.string({ error: 'Ayah from must be a number' }).min(1, { error: 'Ayah from is required' }),
    ayah_to: zod.string({ error: 'Ayah to must be a number' }).min(1, { error: 'Ayah to is required' }),
    quality: zod.enum(LessonQuality, { error: 'Invalid lesson quality' }),
    absence_reason: zod.string().min(0).trim(),
    sheikh_notes: zod.string().min(0).trim(),
    student_notes: zod.string().min(0).trim(),
    recurrence: zod.string().min(0).trim().optional(),
})

export type CreateLessonFormState =
    | {
        error?: {
            student_id?: string[];
            date?: string[];
            type?: string[];
            attendance?: string[];
            juz?: string[];
            surah?: string[];
            ayah_from?: string[];
            ayah_to?: string[];
            quality?: string[];
            absence_reason?: string[];
            sheikh_notes?: string[];
            student_notes?: string[];
            pass_fail?: string[];
            recurrence?: string[];
        }
        message?: string;
    }
    | undefined;

export const UpdateLessonSchema = zod.object({
    schedule_id: zod.string({ error: 'Schedule ID must be a number' }),
    date: zod.string().min(1, { error: 'Date is required' }).trim(),
    type: zod.enum(LessonType, { error: 'Invalid lesson type' }),
    attendance: zod.enum(AttendanceStatus, { error: 'Invalid attendance status' }),
    juz: zod.string({ error: 'Juz must be a number' }).min(1, { error: 'Juz is required' }),
    surah: zod.string().min(1, { error: 'Surah is required' }).trim(),
    ayah_from: zod.string({ error: 'Ayah from must be a number' }).min(1, { error: 'Ayah from is required' }),
    ayah_to: zod.string({ error: 'Ayah to must be a number' }).min(1, { error: 'Ayah to is required' }),
    quality: zod.enum(LessonQuality, { error: 'Invalid lesson quality' }),
    absence_reason: zod.string().min(0, { error: 'Absence reason is required' }).trim(),
    sheikh_notes: zod.string().min(0, { error: 'Sheikh notes is required' }).trim(),
    student_notes: zod.string().min(0, { error: 'Student notes is required' }).trim(),
})

export type UpdateLessonFormState =
    | {
        error?: {
            schedule_id?: string[];
            date?: string[];
            type?: string[];
            attendance?: string[];
            juz?: string[];
            surah?: string[];
            ayah_from?: string[];
            ayah_to?: string[];
            quality?: string[];
            absence_reason?: string[];
            sheikh_notes?: string[];
            student_notes?: string[];
        }
        message?: string;
    }
    | undefined;

export const GetLessonByID = zod.object({
    lesson_id: zod.string({ error: 'Lesson ID must be a number' }),
})

export type GetLessonByIDFormState =
    | {
        error?: {
            lesson_id?: string[];
        }
        message?: string;
        data?: openApi.LessonRead;
    }
    | undefined;

export const createScheduleSchema = zod.object({
    student_id: zod.string({ error: 'Student ID must be a number' }),
    start_time: zod.string().min(1, { error: 'Start time is required' }).trim(),
    end_time: zod.string().min(1, { error: 'End time is required' }).trim(),
    effective_from: zod.string().min(1, { error: 'Effective from is required' }).trim(),
    effective_until: zod.string().min(0, { error: 'Effective until is required' }).trim(),
    rrule_string: zod.string().min(0).trim().optional(),
    notes: zod.string().min(0, { error: 'Notes is required' }).trim(),
})

export type CreateScheduleFormState =
    | {
        error?: {
            student_id?: string[];
            start_time?: string[];
            end_time?: string[];
            effective_from?: string[];
            effective_until?: string[];
            rrule_string?: string[];
            notes?: string[];
        }
        message?: string;
    }
    | undefined;

export const UpdateScheduleSchema = zod.object({
    start_time: zod.string().min(1, { error: 'Start time is required' }).trim(),
    end_time: zod.string().min(1, { error: 'End time is required' }).trim(),
    effective_from: zod.string().min(1, { error: 'Effective from is required' }).trim(),
    effective_until: zod.string().min(0, { error: 'Effective until is required' }).trim(),
    rrule_string: zod.string().min(0).trim().optional(),
    is_active: zod.enum(['true', 'false'], { error: 'Is active must be yes or no' }),
    cancellation_reason: zod.string().min(0, { error: 'Cancellation reason is required' }).trim(),
    notes: zod.string().min(0, { error: 'Notes is required' }).trim(),
})

export type UpdateScheduleFormState =
    | {
        error?: {
            start_time?: string[];
            end_time?: string[];
            effective_from?: string[];
            effective_until?: string[];
            rrule_string?: string[];
            is_active?: string[];
            cancellation_reason?: string[];
            notes?: string[];
        }
        message?: string;
    }
    | undefined;

export const getSchedualesForStudentSchema = zod.object({
    student_id: zod.string({ error: 'Student ID must be a number' }),
})

export type GetSchedualesForStudentFormState =
    | {
        error?: {
            student_id?: string[];
        }
        message?: string;
        data?: openApi.ScheduleRead[];
    }
    | undefined;

export const createLibraryItemSchema = zod.object({
    title: zod.string().min(1, { error: 'Title is required' }).trim(),
    url: zod.string().min(1, { error: 'URL is required' }).url({ error: 'Invalid URL format' }).trim(),
    description: zod.string().min(0, { error: 'Description is required' }).trim(),
    category: zod.string().min(1, { error: 'Category is required' }).trim(),
    tags: zod.string().min(0, { error: 'Tags is required' }).trim(),
    access_level: zod.enum(openApi.LibraryAccessLevel, { error: 'Access level is required' }),
    thumbnail: zod.string().min(0, { error: 'Thumbnail is required' }).url({ error: 'Invalid URL format' }).trim(),
    student_ids: zod.string().min(0, { error: 'Student IDs is required' }).trim(),
})

export type CreateLibraryItemFormState =
    | {
        error?: {
            title?: string[];
            url?: string[];
            description?: string[];
            category?: string[];
            tags?: string[];
            access_level?: string[];
            thumbnail?: string[];
            student_ids?: string[];
        }
        message?: string;
    }
    | undefined;

export const getLibraryItemByIDSchema = zod.object({
    item_id: zod.string({ error: 'Item ID must be a number' }),
})

export type GetLibraryItemByIDFormState =
    | {
        error?: {
            item_id?: string[];
        }
        message?: string;
        data?: openApi.LibraryItemRead;
    }
    | undefined;

export const createStudentSchema = zod.object({
    id: zod.string({ error: 'ID must be a number' }),
    arname: zod.string().min(1, { error: 'Name is required' }).regex(/^[\u0600-\u06FF\s]+$/, { error: 'Name must be in Arabic' }).trim(),
    enname: zod.string().min(1, { error: 'Name is required' }).regex(/^[A-Za-z\s]+$/, { error: 'Name must be in English' }).trim(),
    phone: zod.string().min(1, { error: 'Phone number is required' }).trim(),
    dateOfBirth: zod.string().min(1, { error: 'Date of birth is required' }).trim(),
    timeZone: zod.string().min(1, { error: 'Time zone is required' }).trim(),
    currjuz: zod.string().min(1, { error: 'Current Juz is required' }).trim(),
    currsurah: zod.string().min(1, { error: 'Current Surah is required' }).trim(),
    currayah: zod.string().min(1, { error: 'Current Ayah is required' }).trim(),
    lessonsPerWeek: zod.string().min(1, { error: 'Lessons per week is required' }).trim(),
    lessonRate: zod.string().min(1, { error: 'Lesson rate is required' }).trim(),
    billingCycle: zod.enum(openApi.BillingCycle, { error: 'Billing cycle is required' }),
    specialNotes: zod.string().min(0, { error: 'Special notes is required' }).trim(),
    privateNotes: zod.string().min(0, { error: 'Private notes is required' }).trim(),
    recurrence: zod.string().min(0).trim().optional(),
})

export type CreateStudentFormState =
    | {
        error?: {
            id?: string[];
            arname?: string[];
            enname?: string[];
            phone?: string[];
            dateOfBirth?: string[];
            timeZone?: string[];
            currjuz?: string[];
            currsurah?: string[];
            currayah?: string[];
            lessonsPerWeek?: string[];
            lessonRate?: string[];
            billingCycle?: string[];
            specialNotes?: string[];
            privateNotes?: string[];
            recurrence?: string[];
        }
        message?: string;
    }
    | undefined;

export const getStudentSchema = zod.object({
    id: zod.string({ error: 'ID must be a number' }),
})

export type GetStudentFormState =
    | {
        error?: {
            id?: string[];
        }
        message?: string;
        data?: openApi.StudentRead;
    }
    | undefined;

export const updateStudentSchema = zod.object({
    arname: zod.string().min(1, { error: 'Name is required' }).regex(/^[\u0600-\u06FF\s]+$/, { error: 'Name must be in Arabic' }).trim(),
    enname: zod.string().min(1, { error: 'Name is required' }).regex(/^[A-Za-z\s]+$/, { error: 'Name must be in English' }).trim(),
    phone: zod.string().min(1, { error: 'Phone number is required' }).trim(),
    dateOfBirth: zod.string().min(1, { error: 'Date of birth is required' }).trim(),
    timeZone: zod.string().min(1, { error: 'Time zone is required' }).trim(),
    registerationStatus: zod.enum(openApi.RegistrationStatus, { error: 'Invalid registration status' }),
    status: zod.enum(openApi.StudentStatus, { error: 'Invalid student status' }),
    currjuz: zod.string().min(1, { error: 'Current Juz is required' }).trim(),
    currsurah: zod.string().min(1, { error: 'Current Surah is required' }).trim(),
    currayah: zod.string().min(1, { error: 'Current Ayah is required' }).trim(),
    lessonsPerWeek: zod.string().min(1, { error: 'Lessons per week is required' }).trim(),
    lessonRate: zod.string().min(1, { error: 'Lesson rate is required' }).trim(),
    billingCycle: zod.enum(openApi.BillingCycle, { error: 'Billing cycle is required' }),
    specialNotes: zod.string().min(0, { error: 'Special notes is required' }).trim(),
    privateNotes: zod.string().min(0, { error: 'Private notes is required' }).trim(),
})

export type UpdateStudentFormState =
    | {
        error?: {
            arname?: string[];
            enname?: string[];
            phone?: string[];
            dateOfBirth?: string[];
            timeZone?: string[];
            registerationStatus?: string[];
            status?: string[];
            currjuz?: string[];
            currsurah?: string[];
            currayah?: string[];
            lessonsPerWeek?: string[];
            lessonRate?: string[];
            billingCycle?: string[];
            specialNotes?: string[];
            privateNotes?: string[];
        }
        message?: string;
    }
    | undefined;

export const createInvoiceSchema = zod.object({
    student_id: zod.string().optional(),
    student_ids: zod.string().optional(),
    period_from: zod.string().min(1, { error: 'Period from is required' }).trim(),
    period_to: zod.string().min(1, { error: 'Period to is required' }).trim(),
    due_date: zod.string().min(1, { error: 'Due date is required' }).trim(),
})

export type CreateInvoiceFormState =
    | {
        error?: {
            student_id?: string[];
            student_ids?: string[];
            period_from?: string[];
            period_to?: string[];
            due_date?: string[];
        }
        message?: string;
    }
    | undefined;

export const getInvoiceByIDSchema = zod.object({
    invoice_id: zod.string({ error: 'Invoice ID must be a number' }),
})

export type GetInvoiceByIDFormState =
    | {
        error?: {
            invoice_id?: string[];
        }
        message?: string;
        data?: openApi.InvoiceRead;
    }
    | undefined;

export const overrideInvoiceSchema = zod.object({
    invoice_id: zod.string().min(1),
    invoice_item_id: zod.string().min(1),
    billable: zod.string().min(1),
    override_reason: zod.string().trim().min(3),
})

export type OverrideInvoiceFormState =
    | {
        message?: string;
    }
    | undefined;

export const payInvoiceSchema = zod.object({
    invoice_id: zod.string(),
    paid_date: zod.string().min(1, { error: 'Paid date is required' }).trim(),
    payment_method: zod.string().trim(),
    payment_reference: zod.string().trim(),
    payment_notes: zod.string().trim(),
})

export type PayInvoiceFormState =
    | {
        error?: {
            invoice_id?: string[];
            paid_date?: string[];
            payment_method?: string[];
            payment_reference?: string[];
            payment_notes?: string[];
        }
        message?: string;
    }
    | undefined;

export const getOperationalAnalyticsSchema = zod.object({
    period_start: zod.string().min(1).trim(),
    period_end: zod.string().min(1).trim(),
})

export type GetOperationalAnalyticsFormState =
    | {
        message?: string;
        data?: openApi.OperationalAnalytics;
    }
    | undefined;

export const getAttendanceAnalyticsSchema = zod.object({
    period_start: zod.string().min(1).trim(),
    period_end: zod.string().min(1).trim(),
})

export type GetAttendanceAnalyticsFormState =
    | {
        message?: string;
        data?: openApi.AttendanceAnalytics;
    }
    | undefined;

export const getPerformanceAnalyticsSchema = zod.object({
    period_start: zod.string().min(1).trim(),
    period_end: zod.string().min(1).trim(),
})

export type GetPerformanceAnalyticsFormState =
    | {
        message?: string;
        data?: openApi.PerformanceAnalytics;
    }
    | undefined;

export const getFinancialAnalyticsSchema = zod.object({
    period_start: zod.string().min(1).trim(),
    period_end: zod.string().min(1).trim(),
})

export type GetFinancialAnalyticsFormState =
    | {
        message?: string;
        data?: openApi.FinancialAnalytics;
    }
    | undefined;