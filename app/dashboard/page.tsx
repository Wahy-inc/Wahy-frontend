'use client'

import * as icon from '@deemlol/next-icons'
import { useRouter } from 'next/navigation'

export default function dashboardPage({children: children}: {children: React.ReactNode}  ) {
    const router = useRouter()
    return (
        <div className="flex flex-row justify-between w-[95%] m-4 mt-28 min-h-[90vh]">
            <div id="sidebar" className="bg-slate-900 text-slate-100 lg:w-sm lg:min-h-full h-full rounded-xl shadow-lg mr-4 p-4">
                <h2 className="text-2xl font-bold mb-10 mt-8 cursor-pointer transition duration-300 ease-in-out hover:text-slate-500 hover:translate-x-2" onClick={() => router.push('/dashboard/schedules')}> <icon.Clock className='inline mr-4'/>Schedules</h2>
                <h2 className="text-2xl font-bold mb-10 mt-8 cursor-pointer transition duration-300 ease-in-out hover:text-slate-500 hover:translate-x-2" onClick={() => router.push('/dashboard/lessons')}> <icon.Layers className='inline mr-4'/>Lessons</h2>
                <h2 className="text-2xl font-bold mb-10 mt-8 cursor-pointer transition duration-300 ease-in-out hover:text-slate-500 hover:translate-x-2" onClick={() => router.push('/dashboard/library')}> <icon.Book className='inline mr-4'/>Library</h2>
                <h2 className="text-2xl font-bold mb-10 mt-8 cursor-pointer transition duration-300 ease-in-out hover:text-slate-500 hover:translate-x-2" onClick={() => router.push('/dashboard/students')}> <icon.Users className='inline mr-4'/>My Students</h2>
                <h2 className="text-2xl font-bold mb-10 mt-8 cursor-pointer transition duration-300 ease-in-out hover:text-slate-500 hover:translate-x-2" onClick={() => router.push('/dashboard/join-requests')}> <icon.Inbox className='inline mr-4'/>Join Requests</h2>
                <h2 className="text-2xl font-bold mb-10 mt-8 cursor-pointer transition duration-300 ease-in-out hover:text-slate-500 hover:translate-x-2" onClick={() => router.push('/dashboard/invoices')}> <icon.DollarSign className='inline mr-4'/>Invoices</h2>
            </div>
            <div id="content" className="m-2 w-full bg-slate-100 min-h-full flex flex-col rounded-xl border-slate-900 border-2 p-4 gap-2">
                {children}
            </div>
        </div>
    )
}