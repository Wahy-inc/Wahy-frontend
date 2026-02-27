'use client'

import * as icon from '@deemlol/next-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signout } from '../../actions/auth'
import { useLocalization } from '@/lib/localization-context'
import { OfflineStatusBar } from '@/components/OfflineStatusBar'

export default function DashboardPage({children: children, title: title}: {children: React.ReactNode, title: React.ReactNode}  ) {
    const router = useRouter()
    const { t } = useLocalization()
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    
    return (
        <div className="flex flex-row justify-between w-full mt-14 lg:mt-15 min-h-[90vh]">
            {mobileSidebarOpen ? (
                <button
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                    aria-label="Close menu overlay"
                />
            ) : null}
            <div
                id="sidebar"
                className={`fixed lg:sticky z-40 lg:z-auto top-0 left-0 flex flex-col justify-between pt-16 lg:pt-4 pb-10 lg:pb-20 overflow-x-hidden bg-slate-900 text-slate-100 w-[85vw] max-w-sm lg:w-sm min-h-screen max-h-screen rounded-r-xl shadow-[0px_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div id='services'>
                    <div className='absolute -left-10 top-10 -z-20 w-40 h-40 rounded-full bg-slate-950 blur-[5px]'></div>
                    <div className='absolute -right-10 top-100 -z-20 w-60 h-60 rounded-full bg-slate-700 blur-[5px] opacity-50'></div>
                    <div className='absolute left-5 top-150 -z-10 w-60 h-60 rounded-full bg-slate-800 blur-[5px] opacity-50'></div>
            <h2 className="text-xl lg:text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => {setMobileSidebarOpen(false); router.push('/platform/dashboard/student/schedules')}}> <icon.Clock className='inline mr-4'/>{t('schedules.title')}</h2>
                    <h2 className="text-xl lg:text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => {setMobileSidebarOpen(false); router.push('/platform/dashboard/student/lessons')}}> <icon.Layers className='inline mr-4'/>{t('lessons.title')}</h2>
                    <h2 className="text-xl lg:text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => {setMobileSidebarOpen(false); router.push('/platform/dashboard/student/library')}}> <icon.Book className='inline mr-4'/>{t('library.title')}</h2>
             <h2 className="text-xl lg:text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => {setMobileSidebarOpen(false); router.push('/platform/dashboard/student/profile')}}> <icon.Users className='inline mr-4'/>{t('profile.title')}</h2>
                    <h2 className="text-xl lg:text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => {setMobileSidebarOpen(false); router.push('/platform/dashboard/student/invoices')}}> <icon.DollarSign className='inline mr-4'/>{t('invoices.title')}</h2>
                </div>
                <div id='logout'>
                    <h2 className="text-xl lg:text-2xl text-red-500 font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-red-500 hover:text-slate-200 hover:border-l-4 hover:border-slate-200" onClick={() => signout()}> <icon.LogOut className='inline mr-4'/>{t('auth.logout')}</h2>
                </div>
            </div>
            <div id="content" className="mx-3 my-4 lg:m-10 xl:m-20 w-full bg-slate-100 min-h-full flex flex-col rounded-xl">
                <div className='flex items-center gap-2 px-4 pt-4 lg:hidden'>
                    <button
                        type='button'
                        className='inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-slate-100'
                        onClick={() => setMobileSidebarOpen(true)}
                    >
                        <icon.Menu />
                        Menu
                    </button>
                </div>
                <div id='title' className='sticky top-0 z-20 bg-slate-100 pt-4 lg:pt-10 px-4 lg:px-10 rounded-xl pb-4 flex flex-col gap-3'>
                    <OfflineStatusBar />
                    {title}
                </div>
                <div id='children' className='px-4 lg:px-10 flex flex-col gap-8 mb-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}