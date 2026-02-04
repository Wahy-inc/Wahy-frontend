import * as zod from 'zod';

export const SignUpSchema = zod.object({
    name: zod.string().min(1, { error: 'Name is required' }).trim(),
    email: zod.email({ error: 'Invalid email address' }).trim(),
    password: zod.string().min(6, { error: 'Password must be at least 6 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Password must contain at least one letter' })
    .regex(/[0-9]/, { error: 'Password must contain at least one number' }).trim(),
})

export type FormState = 
| {error?: {
    name?: string[];
    email?: string[];
    password?: string[];
    }
    message?: string;
}
| undefined;