import { getApi } from "@/lib/apiClient"
import * as openApi from "@/lib/openApi"
import { GetAttendanceAnalyticsFormState, GetAttendanceClassMEAnalyticsFormState, GetAttendanceMEAnalyticsFormState, GetAttendanceStudentAnalyticsFormState, GetFinancialAnalyticsFormState, GetOperationalAnalyticsFormState, GetPerformanceAnalyticsFormState } from "@/app/platform/lib/definitions"
import { handleApiCall } from "./common"

const api = getApi()

export async function getAttendanceAnalytics(state: GetAttendanceAnalyticsFormState, formData: FormData): Promise<GetAttendanceAnalyticsFormState> {
    const startDate = formData.get('start-date') as string | undefined
    const endDate = formData.get('end-date') as string | undefined
    const query = startDate && endDate ? { start_date: startDate, end_date: endDate } : undefined
    const res = await handleApiCall(() => api.api.attendanceApiV1AnalyticsAttendanceGet(query))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function getAttendanceStudentAnalytics(state: GetAttendanceStudentAnalyticsFormState, formData: FormData): Promise<GetAttendanceStudentAnalyticsFormState> {
    const studentId = Number(formData.get('student_id'))
    if (isNaN(studentId)) return { message: 'fail' }
    const startDate = formData.get('start-date') as string | undefined
    const endDate = formData.get('end-date') as string | undefined
    const query = startDate && endDate ? { start_date: startDate, end_date: endDate } : undefined
    const res = await handleApiCall(() => api.api.attendanceApiV1AnalyticsAttendanceGet(query))
    return { message: res.data ? 'success' : 'fail', data: res.data as unknown as openApi.StudentAttendanceHoursAnalytics }
}

export async function getPerformanceAnalytics(state: GetPerformanceAnalyticsFormState, formData: FormData): Promise<GetPerformanceAnalyticsFormState> {
    const startDate = formData.get('start-date') as string | undefined
    const endDate = formData.get('end-date') as string | undefined
    const query = startDate && endDate ? { start_date: startDate, end_date: endDate } : undefined
    const res = await handleApiCall(() => api.api.performanceApiV1AnalyticsPerformanceGet(query))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function getFinancialAnalytics(state: GetFinancialAnalyticsFormState, formData: FormData): Promise<GetFinancialAnalyticsFormState> {
    const startDate = formData.get('start-date') as string | undefined
    const endDate = formData.get('end-date') as string | undefined
    const query = startDate && endDate ? { start_date: startDate, end_date: endDate } : undefined
    const res = await handleApiCall(() => api.api.financialApiV1AnalyticsFinancialGet(query))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function getOperationalAnalytics(state: GetOperationalAnalyticsFormState, formData: FormData): Promise<GetOperationalAnalyticsFormState> {
    const startDate = formData.get('start-date') as string | undefined
    const endDate = formData.get('end-date') as string | undefined
    const query = startDate && endDate ? { start_date: startDate, end_date: endDate } : undefined
    const res = await handleApiCall(() => api.api.operationalApiV1AnalyticsOperationalGet(query))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function getAttendanceMEAnalytics(state: GetAttendanceMEAnalyticsFormState, formData: FormData): Promise<GetAttendanceMEAnalyticsFormState> {
    const startDate = formData.get('start-date') as string | undefined
    const endDate = formData.get('end-date') as string | undefined
    const query = startDate && endDate ? { start_date: startDate, end_date: endDate } : undefined
    const res = await handleApiCall(() => api.api.getMyAttendanceHoursApiV1StudentsMeAttendanceHoursGet(query))
    return { message: res.data ? 'success' : 'fail', data: res.data as unknown as openApi.StudentAttendanceHoursAnalytics }
}

export async function getAttendanceClassMEAnalytics(state: GetAttendanceClassMEAnalyticsFormState, formData: FormData): Promise<GetAttendanceClassMEAnalyticsFormState> {
    const startDate = formData.get('start-date') as string | undefined
    const endDate = formData.get('end-date') as string | undefined
    const query = startDate && endDate ? { start_date: startDate, end_date: endDate } : undefined
    const res = await handleApiCall(() => api.api.getMyAttendanceHoursApiV1StudentsMeAttendanceHoursGet(query))
    return { message: res.data ? 'success' : 'fail', data: res.data as unknown as openApi.ClassAttendanceSummary }
}
