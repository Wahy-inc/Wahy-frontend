import { getApi } from "@/lib/apiClient"
import * as openApi from "@/lib/openApi"
import { CreateLibraryItemFormState, createLibraryItemSchema, GetLibraryItemByIDFormState } from "@/app/platform/lib/definitions"
import { DeleteLibraryFileResponseState, DownloadLibraryFileResponseState, ListUploadedLibraryFilesResponseState, uploadLibraryFileResponseState } from "../lib/definitions"
import { handleApiCall } from "./common"

const api = getApi()

export async function listLibrary(per_page: number, page: number): Promise<openApi.PaginatedResponse<openApi.LibraryItemRead> | null> {
    const res = await handleApiCall(() => api.api.listAllApiV1LibraryGet({ per_page, page }))
    return res.data ?? null
}

export async function listLibraryMe(per_page: number, page: number): Promise<openApi.PaginatedResponse<openApi.LibraryItemRead> | null> {
    const res = await handleApiCall(() => api.api.listMyLibraryApiV1LibraryMeGet({ per_page, page }))
    return res.data ?? null
}

export async function getLibraryItem(state: GetLibraryItemByIDFormState, formData: FormData): Promise<GetLibraryItemByIDFormState> {
    const id = Number(formData.get('item-id'))
    if (isNaN(id)) {
        return { error: { item_id: ['Item ID must be a number'] } }
    }
    const res = await handleApiCall(() => api.api.getOneApiV1LibraryItemIdGet(id))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function getLibraryItemMe(state: GetLibraryItemByIDFormState, formData: FormData): Promise<GetLibraryItemByIDFormState> {
    const id = Number(formData.get('item-id'))
    if (isNaN(id)) {
        return { error: { item_id: ['Item ID must be a number'] } }
    }
    const res = await handleApiCall(() => api.api.getMyItemApiV1LibraryMeItemIdGet(id))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function createLibraryItem(state: CreateLibraryItemFormState, formData: FormData): Promise<CreateLibraryItemFormState> {
    const validation = createLibraryItemSchema.safeParse({
        title: formData.get('title'),
        url: formData.get('url'),
        description: formData.get('description'),
        category: formData.get('category'),
        tags: formData.get('tags'),
        access_level: formData.get('access_level'),
        student_ids: formData.get('student_ids'),
    })

    if (!validation.success) {
        return { error: validation.error.flatten().fieldErrors }
    }

    const data = {
        title: validation.data.title,
        external_url: validation.data.url ?? "",
        description: validation.data.description,
        category: validation.data.category,
        tags: validation.data.tags?.split(',').map(tag => tag.trim()) || [],
        access_level: validation.data.access_level,
        thumbnail_image_path: null,
        student_ids: (validation.data.student_ids === '' || !validation.data.student_ids) 
            ? null 
            : validation.data.student_ids.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id)) || null,
    }
    const res = await handleApiCall(() => api.api.createApiV1LibraryPost(data), 201)
    return { message: res.message }
}

export async function deleteLibraryItem(id: number): Promise<string> {
    const res = await handleApiCall(() => api.api.deleteApiV1LibraryItemIdDelete(id), 204)
    return res.message
}

export async function uploadLibraryFile(state: uploadLibraryFileResponseState, formData: FormData): Promise<uploadLibraryFileResponseState> {    
    const file = formData.get('file') as File
    const itemID = Number(formData.get('itemID'))

    if (!file || !itemID) return { message: 'fail' }

    const res = await handleApiCall(() => api.api.uploadLibraryFileApiV1LibraryItemIdFilesPost(itemID, { file }), 201)
    return { message: res.message, data: res.data }
}

export async function listUploadLibraryFile(itemID: number): Promise<ListUploadedLibraryFilesResponseState> {
    const res = await handleApiCall(() => api.api.listLibraryFilesApiV1LibraryItemIdFilesGet(itemID))
    return { message: res.data ? 'success' : 'fail', data: res.data }
}

export async function downloadLibraryFile(itemID: number, fileId: number): Promise<DownloadLibraryFileResponseState> {
    try {
        const response = await api.api.downloadLibraryFileApiV1LibraryItemIdFilesFileIdGet(itemID, fileId, { format: 'blob' })
        if (response.status === 200 && response.data instanceof Blob) {
            const blob = response.data
            if (blob.size < 10) return { message: 'fail' }

            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `libraryfile_${fileId}`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
            return { message: 'success' }
        }
        return { message: 'fail' }
    } catch {
        return { message: 'fail' }
    }
}

export async function deleteLibraryFile(itemID: number, fileId: number): Promise<DeleteLibraryFileResponseState> {
    const res = await handleApiCall(() => api.api.deleteLibraryFileApiV1LibraryItemIdFilesFileIdDelete(itemID, fileId), 204)
    if (!res.data) {
        window.location.reload()
    }
    return { message: res.message }
}
