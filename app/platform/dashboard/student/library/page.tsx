'use client'

import React from "react";
import * as openApi from "@/lib/openApi"
import { getLibraryItemMe, listLibraryMe } from "@/app/platform/actions/dashboard";
import DashboardPage from "../page";
import TitleElement from "./title_element";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { useToastListener } from "@/lib/toastListener";
import { isClientOnline } from "@/lib/offlineSync";
import { UploadedLibraryFile } from "@/app/platform/lib/definitionsv2";
import { downloadLibraryFile, listUploadLibraryFile } from "@/app/platform/actions/dashboardv2";
import { Button } from "@/components/ui/button";
import * as icon from "lucide-react"


export default function Schedules() {

    const [libraryItems, setLibraryItems] = React.useState<openApi.PaginatedResponse<openApi.LibraryItemRead> | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [libraryFiles, setLibraryFiles] = React.useState<Record<number, UploadedLibraryFile[]>>({})
    const [error, setError] = React.useState<string | null>(null)
    const [getLibraryItemState, getLibraryItemAction, getLibraryItemPending] = React.useActionState(getLibraryItemMe, undefined)
    const [getLibraryDialogOpen, setGetLibraryDialogOpen] = React.useState(false)
    // const [isOffline, setIsOffline] = React.useState(false)
    const { isLoading: authLoading } = useAuth()
    const { t , language} = useLocalization()

    const fetchFilesForItems = async () => {
        if (!libraryItems) return
        const filesMap: Record<number, UploadedLibraryFile[]> = {}
        
        for (const item of libraryItems.items) {
            try {
                const res = await listUploadLibraryFile(item.id)
                filesMap[item.id] = res?.data || []
            } catch (err) {
                console.error(`Failed to load files for item ${item.id}:`, err)
                filesMap[item.id] = []
            }
        }
        
        setLibraryFiles(filesMap)
    }

    useToastListener(getLibraryItemState, {functionName: "Get Library Item", successMessage: t('messages.success'), errorMessage: t('messages.error')})
    // React.useEffect(() => {
    //     // const refreshOffline = () => setIsOffline(!isClientOnline())
    //     // refreshOffline()
    //     // window.addEventListener('online', refreshOffline)
    //     // window.addEventListener('offline', refreshOffline)

    //     return () => {
    //         window.removeEventListener('online', refreshOffline)
    //         window.removeEventListener('offline', refreshOffline)
    //     }
    // }, [])

    React.useEffect(() => {        
        if (getLibraryItemState?.message === 'success' && getLibraryItemState.data) {
            setLibraryItems({ items: [getLibraryItemState.data] , total: 1, page: 1, per_page: 1, has_next: false}) // Wrap in paginated response format
        }
    }, [getLibraryItemState])

    React.useEffect(() => {
        if (authLoading) return // Wait until auth is loaded

        // const cachedLibraryItems = getCachedData<openApi.PaginatedResponse<openApi.LibraryItemRead>>(
        //     offlineCacheKeys.libraryListMe,
        // )
        // if (cachedLibraryItems && cachedLibraryItems.length > 0) {
        //     setLibraryItems(cachedLibraryItems)
        //     setLoading(false)
        // }
        
        const fetchLibraryItems = async () => {
            try {
                setLoading(true)
                const data = await listLibraryMe(10,1)
                setLibraryItems(data)
                await fetchFilesForItems()
                setError(null)
            } catch (err) {
                setError('Failed to load library items')
                setLibraryItems(null)
            } finally {
                setLoading(false)
            }
        }
        fetchLibraryItems()
    }, [authLoading])

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const libraryItemElement = (item: openApi.LibraryItemRead) => (
        <Card dir={language == 'ar' ? 'rtl' : 'ltr'} className="relative mx-auto min-w-xl pt-0 overflow-hidden pb-2 h-fit grid grid-rows-[1fr_auto]">
            <div className="grid grid-cols-[3fr_1fr] row-start-1 row-end-2 cursor-pointer border-b-2 border-slate-300 pb-5">
                <CardHeader className="col-start-1 col-end-2">
                    <div className="grid grid-rows-3 gap-1 px-1 py-5">
                        <CardTitle onClick={() => window.location.href=item.external_url} className="cursor-pointer hover:text-slate-500" style={{gridColumnStart: '1 !important', gridColumnEnd:'2 !important', gridRowStart: '2 !important', gridRowEnd:'3 !important'}}>{item.title}</CardTitle>
                        <div className='mb-1' style={{gridColumnStart: '1 !important', gridColumnEnd:'2 !important', gridRowStart: '1 !important', gridRowEnd:'2 !important'}}>
                            <Badge variant="secondary" className='mx-1'>{item.category || 'Uncategorized'}</Badge>
                            <Badge variant="secondary" className='mx-1'>{item.access_level || 'No Access Level'}</Badge>
                            <Badge variant="secondary" className='mx-1'>{item.download_count || '0'} Downloads</Badge>
                            <Badge variant="secondary" className='mx-1'>{item.view_count || '0'} Views</Badge>
                        </div>
                        <CardDescription style={{gridColumnStart: '1 !important', gridColumnEnd:'2 !important', gridRowStart: '3 !important', gridRowEnd:'4 !important'}}>
                            {item.description && item.description.length > 100 ? item.description.substring(0, 100) + '...' : (item.description || 'No description')}
                        </CardDescription>
                    </div>
                    <div className="flex -flex-row">
                        <p className="text-sm text-muted-foreground">Tags:</p>
                        {item.tags && item.tags.length > 0 ? (() => {
                            try {
                                const parsedTags = JSON.parse(item.tags[0])
                                return parsedTags.map((tag: string, index: number) => (
                                    <Badge key={index} variant="outline" className='mx-1'>{tag}</Badge>
                                ))
                            } catch {
                                return <span>Error parsing tags</span>
                            }
                        })() : null}
                    </div>
                </CardHeader>
                <div id="buttons" className="p-4 flex flex-col justify-between col-start-2 col-end-3">
                </div>
            </div>
            <CardContent className="w-full row-start-2 row-end-3 overflow-y-auto max-h-50">
                {(libraryFiles[item.id] || []).map((file: UploadedLibraryFile) => (
                    <div key={file.id} className="flex flex-row items-center justify-between bg-gray-100 rounded-lg p-2 m-2">
                        <div className="flex flex-col justify-between">
                            <div className="flex flex-row gap-2">
                                <div className="flex items-center gap-2">
                                    <icon.File className="text-slate-800" size={16} />
                                    <span className="text-slate-800">{file.original_filename}</span>
                                </div>
                                <div>
                                    <Badge variant="outline" className='mx-1 border-slate-800 text-slate-800'>{(file.file_size_bytes / 1024).toFixed(2)} KB</Badge>
                                    <Badge variant="default" className='mx-1 bg-slate-800 text-white'>{(file.download_count)} Downloads</Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <icon.Clock className="text-slate-500" size={16} />
                                <span className="text-slate-500 text-sm">Created: {new Date(file.created_at).toLocaleDateString()} | Updated: {new Date(file.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <Button variant="outline" size="sm" onClick={() => downloadLibraryFile(item.id, file.id)}>
                                <icon.Download className="text-green-500" size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )

    const title = (
        <TitleElement
            title={t('library.title')}
            getLibraryAction={getLibraryItemAction}
            getLibraryState={getLibraryItemState}
            getLibraryPending={getLibraryItemPending}
            fieldInput={fieldInput}
            getLibraryDialogOpen={getLibraryDialogOpen}
            setgetLibraryDialogOpen={setGetLibraryDialogOpen}
        />
    )

    if (loading) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('common.loading')}</p></DashboardPage>
    if (error) return <DashboardPage title={title}><p className="text-red-500 text-xl">{error}</p></DashboardPage>
    if (!libraryItems || libraryItems.items.length === 0) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('library.no_books_found')}</p></DashboardPage>

    const content = libraryItems.items?.map((item) => (
        <div key={item.id} className="w-full">
            {libraryItemElement(item)}
        </div>
    ))

    return <DashboardPage title={title}>
        <div className="flex flex-col gap-4 w-full">
            {/* {isOffline ? <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{t('library.offline_only')}</p> : null} */}
            <div className="grid grid-cols-1 lg:gap-4 gap-2 2xl:grid-cols-4 md:grid-cols-2 items-stretch content-stretch justify-stretch">{content}</div>
        </div>
        <div id="pagination" className="grid grid-cols-3 text-sm my-4">
            <div className="col-start-1 col-end-2"></div>
            <div className="col-start-2 col-end-3">
                page <span className="font-bold text-slate-800">{libraryItems.page}</span> of <span className="font-bold text-slate-800">{Math.ceil((libraryItems.total || 0) / libraryItems.per_page)}</span>
            </div>
            <div className="flex flex-row justify-end items-center gap-2 col-start-3 col-end-4">
                <Button variant="outline" disabled={libraryItems.page === 1 || libraryItems.items.length === 0} onClick={
                    () => listLibraryMe(10, libraryItems.page - 1).then((data) => {
                        if (data) {
                            setLibraryItems(data)
                        }
                    })
                }>Previous</Button>
                <Button variant="outline" disabled={!libraryItems.has_next || libraryItems.items.length === 0} onClick={
                    () => listLibraryMe(10, libraryItems.page + 1).then((data) => {
                        if (data) {
                            setLibraryItems(data)
                        }
                    })
                }>Next</Button>
            </div>
        </div>
    </DashboardPage>
}