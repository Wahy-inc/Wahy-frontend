import * as zod from 'zod';

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