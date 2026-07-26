import { getApi } from "@/lib/apiClient"
import * as openApi from "@/lib/openApi"
import { CreateInvoiceFormState, createInvoiceSchema, GetInvoiceByIDFormState, OverrideInvoiceFormState, overrideInvoiceSchema, PayInvoiceFormState, payInvoiceSchema } from "@/app/platform/lib/definitions"
import { handleApiCall } from "./common"

const api = getApi()

export async function listInvoices(per_page: number, page: number): Promise<openApi.PaginatedResponse<openApi.InvoiceRead>> {
    const res = await handleApiCall(() => api.api.listAllApiV1InvoicesGet({ per_page, page }))
    return res.data ?? { items: [], total: 0, has_next: false, page: 1, per_page: 10 }
}

export async function listInvoicesMe(per_page: number, page: number): Promise<openApi.PaginatedResponse<openApi.InvoiceRead>> {
    const res = await handleApiCall(() => api.api.listMyInvoicesApiV1InvoicesMeGet({ per_page, page }))
    return res.data ?? { items: [], total: 0, has_next: false, page: 1, per_page: 10 }
}

export async function getInvoice(state: GetInvoiceByIDFormState, formData: FormData): Promise<GetInvoiceByIDFormState> {
    const id = Number(formData.get('invoice_id'))
    if (isNaN(id)) {
        return { error: { invoice_id: ['Invoice ID must be a number'] } }
    }
    const res = await handleApiCall(() => api.api.getOneApiV1InvoicesInvoiceIdGet(id))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function getInvoiceMe(state: GetInvoiceByIDFormState, formData: FormData): Promise<GetInvoiceByIDFormState> {
    const id = Number(formData.get('invoice_id'))
    if (isNaN(id)) {
        return { error: { invoice_id: ['Invoice ID must be a number'] } }
    }
    const res = await handleApiCall(() => api.api.getMyInvoiceApiV1InvoicesMeInvoiceIdGet(id))
    return { message: res.data ? 'success' : 'fail', data: res.data }
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
    const res = await handleApiCall(() => api.api.generateApiV1InvoicesGeneratePost(data))
    return { message: res.message }
}

export async function overrideInvoice(state: OverrideInvoiceFormState, formData: FormData): Promise<OverrideInvoiceFormState> {
    const rawInvoiceId = formData.get('invoice_id')
    const rawItemId = formData.get('item_id') || rawInvoiceId
    const validation = overrideInvoiceSchema.safeParse({
        invoice_id: rawInvoiceId,
        billable: formData.get('billable'),
        override_reason: formData.get('override_reason'),
    })

    if (!validation.success) {
        return { message: 'fail' }
    }

    const invoiceId = Number(validation.data.invoice_id)
    const itemId = Number(rawItemId || validation.data.invoice_id)
    const data: openApi.InvoiceItemOverrideRequest = {
        item_id: itemId,
        billable: validation.data.billable.toLowerCase() === 'yes',
        override_reason: validation.data.override_reason,
    }
    const res = await handleApiCall(() => api.api.overrideItemApiV1InvoicesInvoiceIdOverridesPost(invoiceId, data))
    return { message: res.message }
}

export async function downloadInvoicePDF(id: number): Promise<boolean> {
    try {
        const response = await api.api.getPdfApiV1InvoicesInvoiceIdPdfGet(id)
        if (response.status === 200 && response.data instanceof Blob) {
            const blob = response.data
            if (blob.size < 50) return false

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `invoice_${id}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            return true
        }
        return false
    } catch {
        return false
    }
}

export async function downloadInvoicePDFMe(id: number): Promise<boolean> {
    try {
        const response = await api.api.getMyPdfApiV1InvoicesMeInvoiceIdPdfGet(id)
        if (response.status === 200 && response.data instanceof Blob) {
            const blob = response.data
            if (blob.size < 50) return false

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `invoice_${id}.pdf`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            return true
        }
        return false
    } catch {
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

    const id = Number(validation.data.invoice_id)
    const data: openApi.InvoicePaidRequest = {
        paid_date: validation.data.paid_date,
        payment_method: validation.data.payment_method,
        payment_reference: validation.data.payment_reference,
        payment_notes: validation.data.payment_notes,
    }
    const res = await handleApiCall(() => api.api.markInvoicePaidApiV1InvoicesInvoiceIdPaidPatch(id, data))
    return { message: res.message }
}
