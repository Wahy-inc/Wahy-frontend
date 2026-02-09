'use client'

import * as icon from '@deemlol/next-icons'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { signout } from '../actions/auth'
import { listStudents } from '../actions/dashboard'

export default function DashboardPage({children: children, title: title}: {children: React.ReactNode, title: React.ReactNode}  ) {
    const router = useRouter()
    
    useEffect(() => {
        localStorage.setItem('access_token', '')
        localStorage.setItem('expire', '')
        localStorage.setItem('students', JSON.stringify([]))
        listStudents()
    }, [])

    return (
        <div className="flex flex-row justify-between w-full mt-15 min-h-[90vh]">
            <div id="sidebar" className="flex flex-col justify-between pt-4 pb-20 sticky top-0 overflow-x-hidden bg-slate-900 text-slate-100 lg:w-sm min-h-screen max-h-screen rounded-r-xl mr-4 shadow-[0px_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
                <div id='services'>
                    <div className='absolute -left-10 top-10 -z-20 w-40 h-40 rounded-full bg-slate-950 blur-[5px]'></div>
                    <div className='absolute -right-10 top-100 -z-20 w-60 h-60 rounded-full bg-slate-700 blur-[5px] opacity-50'></div>
                    <div className='absolute left-5 top-150 -z-10 w-60 h-60 rounded-full bg-slate-800 blur-[5px] opacity-50'></div>
                    <h2 className="text-2xl font-bold pt-10 p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/platform/dashboard/schedules')}> <icon.Clock className='inline mr-4'/>Schedules</h2>
                    <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/platform/dashboard/lessons')}> <icon.Layers className='inline mr-4'/>Lessons</h2>
                    <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/platform/dashboard/library')}> <icon.Book className='inline mr-4'/>Library</h2>
                    <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/platform/dashboard/students')}> <icon.Users className='inline mr-4'/>My Students</h2>
                    <h2 className="text-2xl font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-slate-500 hover:text-slate-950 hover:border-l-4 hover:border-slate-200" onClick={() => router.push('/platform/dashboard/invoices')}> <icon.DollarSign className='inline mr-4'/>Invoices</h2>
                </div>
                <div id='logout'>
                    <h2 className="text-2xl text-red-500 font-bold p-5 pr-0 cursor-pointer transition duration-300 ease-in-out hover:translate-x-2 hover:bg-red-500 hover:text-slate-200 hover:border-l-4 hover:border-slate-200" onClick={() => signout()}> <icon.LogOut className='inline mr-4'/>Logout</h2>
                </div>
            </div>
            <div id="content" className="m-20 w-full bg-slate-100 min-h-full flex flex-col rounded-xl">
                <div id='title' className='sticky top-0 z-50 bg-slate-100 pt-10 px-10 rounded-xl pb-4'>
                    {title}
                </div>
                <div id='children' className='px-10 flex flex-col gap-8 mb-10'>
                    {children}
                </div>
            </div>
        </div>
    )
}