import { SignInFormState, SignInSchema, SignInStudentFormState, SignInStudentSchema } from "@/app/platform/lib/definitions"
import { getApi } from "@/lib/apiClient"
import * as openApi from "@/lib/openApi"

const api = getApi()

export async function signinStudent(state: SignInStudentFormState, formData: FormData): Promise<SignInStudentFormState> {
    const validation = SignInStudentSchema.safeParse({
        student_code: formData.get('student_code'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    try {
        const data: openApi.LoginRequestStudent = {
            student_code: validation.data.student_code,
        }
        const response = await api.api.studentSigninApiV1AuthStudentSigninPost(data)
        
        if (response.status === 200 && response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('expire', response.data.expires_at)
            localStorage.setItem('role', 'student')
            return { message: 'Signin successful' }
        }
        if (response.status === 422) {
            return { message: 'Validation error' }
        }

        return { message: response.error?.detail?.[0]?.msg || 'Signin failed' }
    } catch {
        return { message: 'An error occurred during signin' }
    }
}

export async function signinAdmin(state: SignInFormState, formData: FormData): Promise<SignInFormState> {
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
        const response = await api.api.adminSigninApiV1AuthAdminSigninPost(data)
        
        if (response.status === 200 && response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('expire', response.data.expires_at)
            localStorage.setItem('role', 'admin')
            return { message: 'Signin successful' }
        }
        if (response.status === 422) {
            return { message: 'Validation error' }
        }

        return { message: response.error?.detail?.[0]?.msg || 'Signin failed' }
    } catch {
        return { message: 'An error occurred during signin' }
    }
}

export async function refreshAccessToken() {
    try {
        const response = await api.api.refreshApiV1AuthRefreshPost()

        if (response.status === 200 && response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('expire', response.data.expires_at)
            return { message: 'Token refreshed successfully' }
        }
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token')
            localStorage.removeItem('expire')
            localStorage.removeItem('role')
            window.location.href = '/platform/auth/login'
        }
    } catch {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token')
            localStorage.removeItem('expire')
            localStorage.removeItem('role')
            window.location.href = '/platform/auth/login'
        }
        return { message: 'An error occurred during token refresh' }
    }
}

export async function checkHealth(): Promise<{ message: string }> {
    try {
        const response = await api.health.healthHealthGet()

        if (response.data.status === 'ok') {
            return { message: 'API is healthy' }
        }
        if (response.data.status === 'degraded') {
            return { message: 'SERVER IS UNAVAILABLE' }
        }
        return { message: 'API health status: ' + response.data.status }
    } catch {
        return { message: 'An error occurred while checking API health' }
    }
}

export async function signout() {
    try {
        const response = await api.api.logoutApiV1AuthLogoutPost()

        if (response.status === 204) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('expire')
            localStorage.removeItem('role')
            window.location.href = '/'
            return { message: 'Signout successful' }
        }
    } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('expire')
        localStorage.removeItem('role')
        if (typeof window !== 'undefined') {
            window.location.href = '/'
        }
        return { message: 'An error occurred during signout' }
    }
}