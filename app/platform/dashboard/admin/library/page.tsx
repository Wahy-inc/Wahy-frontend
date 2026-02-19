'use client'

import React from "react";
import * as openApi from "@/lib/openApi"
import { createLibraryItem, deleteLibraryItem, getLibraryItem, listLibrary } from "@/app/platform/actions/dashboard";
import DashboardPage from "../page";
import TitleElement from "./title_element";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge"
import * as icon from "lucide-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useLocalization } from "@/lib/localization-context";
import { useToastListener } from "@/lib/toastListener";
import { getCachedData, offlineCacheKeys } from "@/lib/offlineCache";
import { isClientOnline } from "@/lib/offlineSync";
import Image from "next/image";


export default function Schedules() {
    const [libraryItems, setLibraryItems] = React.useState<openApi.LibraryItemRead[] | null>(null)
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [createLibraryItemState, createLibraryItemAction, createLibraryItemPending] = React.useActionState(createLibraryItem, undefined)
    const [getLibraryItemState, getLibraryItemAction, getLibraryItemPending] = React.useActionState(getLibraryItem, undefined)
    const [createLibraryDialogOpen, setCreateLibraryDialogOpen] = React.useState(false)
    const [getLibraryDialogOpen, setGetLibraryDialogOpen] = React.useState(false)
    const [isOffline, setIsOffline] = React.useState(false)
    const { isAdmin, isLoading: authLoading } = useAuth()
    const { t } = useLocalization()

    useToastListener(createLibraryItemState, {functionName: "Create Library Item", successMessage: t('messages.success'), errorMessage: t('messages.error')})
    useToastListener(getLibraryItemState, {functionName: "Get Library Item", successMessage: t('messages.success'), errorMessage: t('messages.error')})
    React.useEffect(() => {
        const refreshOffline = () => setIsOffline(!isClientOnline())
        refreshOffline()
        window.addEventListener('online', refreshOffline)
        window.addEventListener('offline', refreshOffline)

        return () => {
            window.removeEventListener('online', refreshOffline)
            window.removeEventListener('offline', refreshOffline)
        }
    }, [])

    React.useEffect(() => {        
        if (getLibraryItemState?.message === 'success' && getLibraryItemState.data) {
            setLibraryItems([getLibraryItemState.data])
        }
        if (createLibraryItemState?.message === 'success') {
            const fetchLibraryItems = async () => {
                try {
                    setLoading(true)
                    const data = await listLibrary()
                    setLibraryItems(data)
                    setError(null)
                } catch (err) {
                    setError('Failed to load library items')
                    setLibraryItems(null)
                } finally {
                    setLoading(false)
                }
            }
            fetchLibraryItems()
        }
    }, [getLibraryItemState, createLibraryItemState])

    React.useEffect(() => {
        if (authLoading) return // Wait until auth is loaded

        const cachedLibraryItems = getCachedData<openApi.LibraryItemRead[]>(
            offlineCacheKeys.libraryListAdmin,
        )
        if (cachedLibraryItems && cachedLibraryItems.length > 0) {
            setLibraryItems(cachedLibraryItems)
            setLoading(false)
        }
        
        const fetchLibraryItems = async () => {
            try {
                setLoading(true)
                const data = await listLibrary()
                setLibraryItems(data)
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

    if (!isAdmin) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Access Denied</h1>
                        <p className="text-lg">You do not have permission to view this page.</p>
                    </div>
                </div>
            )
        }

    const fieldInput = (label: string, name: string, holder: string, type: string) => (        
        <Field orientation="vertical" className='w-full inline'>
            <Label htmlFor={name}>{label}</Label>
            <Input id={name} name={name} type={type} placeholder={holder} defaultValue={holder}></Input>
        </Field>
    )

    const libraryItemElement = (item: openApi.LibraryItemRead) => (
            <Card className="relative mx-auto w-full max-w-sm pt-0 overflow-hidden pb-2 min-h-full flex flex-col justify-between">
            <div onClick={() => window.location.href=item.external_url} className="cursor-pointer">
                <div className="absolute inset-0 z-10 aspect-video bg-black/35" />
                <Image
                    src={item.thumbnail_image_path || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt="Event cover"
                    width={400}
                    height={200}
                    className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                />
                <CardHeader>
                    <div className="grid grid-rows-3 gap-1 pt-1">
                        <div className='mb-3' style={{gridColumnStart: '1 !important', gridColumnEnd:'2 !important', gridRowStart: '1 !important', gridRowEnd:'2 !important'}}>
                            <Badge variant="secondary" className='mx-1'>{item.category || 'Uncategorized'}</Badge>
                            <Badge variant="secondary" className='mx-1'>{item.access_level || 'No Access Level'}</Badge>
                            <Badge variant="secondary" className='mx-1'>{item.download_count || '0'}</Badge>
                            <Badge variant="secondary" className='mx-1'>{item.view_count || '0'}</Badge>
                        </div>
                        <CardTitle style={{gridColumnStart: '1 !important', gridColumnEnd:'2 !important', gridRowStart: '2 !important', gridRowEnd:'3 !important'}}>{item.title}</CardTitle>
                        <CardDescription style={{gridColumnStart: '1 !important', gridColumnEnd:'2 !important', gridRowStart: '3 !important', gridRowEnd:'4 !important'}}>
                            {item.description && item.description.length > 100 ? item.description.substring(0, 100) + '...' : 'No description provided.'}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardFooter>
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
                </CardFooter>
                </div>
                <Button disabled={isOffline} onClick={() => {
                    if (isOffline) {
                        return
                    }
                    deleteLibraryItem(item.id)
                }} variant='destructive' className="transition duration-300 hover:bg-red-800 mx-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <icon.Trash className="text-white cursor-pointer" size={16}/>
                </Button>
            </Card>
    )

    const title = (
        <TitleElement
            title={t('library.title')}
            createAction={createLibraryItemAction}
            createState={createLibraryItemState}
            createPending={createLibraryItemPending}
            getLibraryAction={getLibraryItemAction}
            getLibraryState={getLibraryItemState}
            getLibraryPending={getLibraryItemPending}
            fieldInput={fieldInput}
            createLibraryDialogOpen={createLibraryDialogOpen}
            setcreateLibraryDialogOpen={setCreateLibraryDialogOpen}
            getLibraryDialogOpen={getLibraryDialogOpen}
            setgetLibraryDialogOpen={setGetLibraryDialogOpen}
            disableCreate={isOffline}
        />
    )

    if (loading) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('common.loading')}</p></DashboardPage>
    if (error) return <DashboardPage title={title}><p className="text-red-500 text-xl">{error}</p></DashboardPage>
    if (!libraryItems || libraryItems.length === 0) return <DashboardPage title={title}><p className="text-slate-700 text-xl">{t('library.no_books_found')}</p></DashboardPage>

    const content = libraryItems?.map((item) => (
        <div key={item.id} className="w-full">
            {libraryItemElement(item)}
        </div>
    ))

    return <DashboardPage title={title}><div className="flex flex-col gap-4 w-full">
        {isOffline ? <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{t('library.offline_only')}</p> : null}
        <div className="grid grid-cols-1 lg:gap-4 gap-2 2xl:grid-cols-4 md:grid-cols-2 items-stretch content-stretch justify-stretch">{content}</div>
    </div></DashboardPage>
}