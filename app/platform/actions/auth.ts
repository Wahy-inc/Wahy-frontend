import { SignupFormState, SignInFormState, SignUpSchema, SignInSchema } from "@/app/platform/lib/definitions"
import * as openApi from "@/lib/openApi"

const api = new openApi.Api({
    baseUrl: 'http://10.60.184.80:8000',
})

const formatDate = (isoDate: string): string | undefined => {
    return new Date(isoDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
    })
}

export async function signup(state: SignupFormState, formData: FormData): Promise<SignupFormState> {
    const validation = SignUpSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('date-of-birth'),
        timeZone: formData.get('time-zone'),
        currjuz: formData.get('current-juz'),
        currsurah: formData.get('current-surah'),
        currayah: formData.get('current-ayah'),
        lessonsPerWeek: formData.get('lessons-per-week'),
        lessonRate: formData.get('lesson-rate'),
        BillingCycle: formData.get('billing-cycle'),
        specialNotes: formData.get('special-notes'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    try {
        const data: openApi.StudentSignupRequest = {
            email: validation.data.email,
            password: validation.data.password,
            full_name_arabic: validation.data.arname,
            full_name_english: validation.data.enname,
            date_of_birth: validation.data.dateOfBirth,
            phone: validation.data.phone,
            timezone: validation.data.timeZone,
            current_juz: Number(validation.data.currjuz),
            current_surah: validation.data.currsurah,
            current_ayah: Number(validation.data.currayah),
            lessons_per_week: Number(validation.data.lessonsPerWeek),
            lesson_rate: Number(validation.data.lessonRate),
            billing_cycle: validation.data.BillingCycle as openApi.BillingCycle,
            special_notes: validation.data.specialNotes,
        }
        const response = await api.api.studentSignupApiV1AuthStudentSignupPost(data)
        
        if (response.status === 201 && response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('expire', formatDate(response.data.expires_at) || '')
            return {message: 'Signup successful' }
        }
        if (response.status === 422) {
            return { message: 'Validation error' }
        }

        return {message: response.error?.detail?.[0]?.msg || 'Signup failed' }
    } catch (error) {
        return { message: 'An error occurred during signup' }
    }
}

export async function signin(state: SignInFormState, formData: FormData): Promise<SignInFormState> {
    const validation = SignInSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    try {
        const data = {
            email: validation.data.email,
            password: validation.data.password,
        }
        const response = await api.api.studentSigninApiV1AuthStudentSigninPost(data)
        
        if (response.status === 200 && response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('expire', formatDate(response.data.expires_at) || '')
            return {message: 'Signin successful' }
        }
        if (response.status === 422) {
            return { message: 'Validation error' }
        }

        return {message: response.error?.detail?.[0]?.msg || 'Signin failed' }
    } catch (error) {
        return { message: 'An error occurred during signin' }
    }
}

export async function refreshAccessToken() {
    try {
        const response = await api.api.refreshApiV1AuthRefreshPost()

        if (response.status === 200 && response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('expire', formatDate(response.data.expires_at) || '')
            return {message: 'Token refreshed successfully' }
        }
    } catch (error) {
        return { message: 'An error occurred during token refresh' }
    }
}

export async function signout() {
    try {
        const response = await api.api.logoutApiV1AuthLogoutPost()

        if (response.status === 204) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('expire')
            window.location.href = '/'
            return {message: 'Signout successful' }
        }
    } catch (error) {
        return { message: 'An error occurred during signout' }
    }
}