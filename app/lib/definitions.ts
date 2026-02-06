import { AttendanceStatus, LessonQuality, LessonType } from '@/lib/openApi';
import * as zod from 'zod';
import * as openApi from "../../lib/openApi"

export const SignUpSchema = zod.object({
    arname: zod.string().min(1, { error: 'Name is required' }).regex(/^[\u0600-\u06FF\s]+$/, { error: 'Name must be in Arabic' }).trim(),
    enname: zod.string().min(1, { error: 'Name is required' }).regex(/^[A-Za-z\s]+$/, { error: 'Name must be in English' }).trim(),
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
    BillingCycle: zod.string().min(1, { error: 'Billing cycle is required' }).trim(),
    specialNotes: zod.string().min(0, { error: 'Special notes is required' }).trim(),
})

export type SignupFormState = 
| {error?: {
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
    BillingCycle?: string[];
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
| {error?: {
    email?: string[];
    password?: string[];
    }
    message?: string;
}
| undefined;

export const CreatLessonSchema = zod.object({
    student_id: zod.string({ error: 'Student ID must be a number' }),
    schedule_id: zod.string({ error: 'Schedule ID must be a number' }),
    date: zod.string().min(1, { error: 'Date is required' }).trim(),
    type: zod.enum(LessonType, { error: 'Invalid lesson type' }),
    attendance: zod.enum(AttendanceStatus, { error: 'Invalid attendance status' }),
    juz: zod.string({ error: 'Juz must be a number' }).min(1, { error: 'Juz is required' }),
    surah: zod.string().min(1, { error: 'Surah is required' }).trim(),
    ayah_from: zod.string({ error: 'Ayah from must be a number' }).min(1, { error: 'Ayah from is required' }),
    ayah_to: zod.string({ error: 'Ayah to must be a number' }).min(1, { error: 'Ayah to is required' }),
    quality: zod.enum(LessonQuality, { error: 'Invalid lesson quality' }),
    attempts: zod.string({ error: 'Attempts must be a number' }).min(1, { error: 'Attempts is required' }),
    absence_reason: zod.string().min(0, { error: 'Absence reason is required' }).trim(),
    sheikh_notes: zod.string().min(0, { error: 'Sheikh notes is required' }).trim(),
    student_notes: zod.string().min(0, { error: 'Student notes is required' }).trim(),
})

export type CreateLessonFormState = 
| {error?: {
    student_id?: string[];
    schedule_id?: string[];
    date?: string[];
    type?: string[];
    attendance?: string[];
    juz?: string[];
    surah?: string[];
    ayah_from?: string[];
    ayah_to?: string[];
    quality?: string[];
    attempts?: string[];
    absence_reason?: string[];
    sheikh_notes?: string[];
    student_notes?: string[];
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
    attempts: zod.string({ error: 'Attempts must be a number' }).min(1, { error: 'Attempts is required' }),
    absence_reason: zod.string().min(0, { error: 'Absence reason is required' }).trim(),
    sheikh_notes: zod.string().min(0, { error: 'Sheikh notes is required' }).trim(),
    student_notes: zod.string().min(0, { error: 'Student notes is required' }).trim(),
})

export type UpdateLessonFormState = 
| {error?: {
    schedule_id?: string[];
    date?: string[];
    type?: string[];
    attendance?: string[];
    juz?: string[];
    surah?: string[];
    ayah_from?: string[];
    ayah_to?: string[];
    quality?: string[];
    attempts?: string[];
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
| {error?: {
    lesson_id?: string[];
}
message?: string;
data?: openApi.LessonRead;
}
| undefined;

enum weekDays {
    saturday = 0,
    sunday = 1,
    monday = 2,
    tuesday = 3,
    wednesday = 4,
    thursday = 5,
    friday = 6
}

export const createScheduleSchema = zod.object({
    student_id: zod.string({ error: 'Student ID must be a number' }),
    day_of_week: zod.enum(weekDays, { error: 'Invalid day of week' }),
    start_time: zod.string().min(1, { error: 'Start time is required' }).trim(),
    end_time: zod.string().min(1, { error: 'End time is required' }).trim(),
    effective_from: zod.string().min(1, { error: 'Effective from is required' }).trim(),
    effective_until: zod.string().min(0, { error: 'Effective until is required' }).trim(),
    is_recurring: zod.enum(['true', 'false'], { error: 'Is recurring must be yes or no' }),
    notes: zod.string().min(0, { error: 'Notes is required' }).trim(),
})

export type CreateScheduleFormState = 
| {error?: {
    student_id?: string[];
    day_of_week?: string[];
    start_time?: string[];
    end_time?: string[];
    effective_from?: string[];
    effective_until?: string[];
    is_recurring?: string[];
    notes?: string[];
}
message?: string;
}
| undefined;

export const UpdateScheduleSchema = zod.object({
    day_of_week: zod.enum(weekDays, { error: 'Invalid day of week' }),
    start_time: zod.string().min(1, { error: 'Start time is required' }).trim(),
    end_time: zod.string().min(1, { error: 'End time is required' }).trim(),
    effective_from: zod.string().min(1, { error: 'Effective from is required' }).trim(),
    effective_until: zod.string().min(0, { error: 'Effective until is required' }).trim(),
    is_recurring: zod.enum(['true', 'false'], { error: 'Is recurring must be yes or no' }),
    is_active: zod.enum(['true', 'false'], { error: 'Is active must be yes or no' }),
    cancellation_reason: zod.string().min(0, { error: 'Cancellation reason is required' }).trim(),
    notes: zod.string().min(0, { error: 'Notes is required' }).trim(),
})

export type UpdateScheduleFormState = 
| {error?: {
    day_of_week?: string[];
    start_time?: string[];
    end_time?: string[];
    effective_from?: string[];
    effective_until?: string[];
    is_recurring?: string[];
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
| {error?: {
    student_id?: string[];
}
message?: string;
data?: openApi.ScheduleRead[];
}
| undefined;