import { FormState, SignUpSchema } from "../lib/definitions"

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
    const validation = SignUpSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    
}