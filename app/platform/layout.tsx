'use client'

import { AuthProvider } from '@/lib/auth-context'

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <div id="navbar" className="z-50 w-full h-14 lg:h-20 absolute top-0 p-1 flex flex-row items-center bg-slate-900 text-slate-100 shadow-[0px_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div className="flex-1">
          <a className="text-2xl pl-4 font-bold">Wahy</a>
        </div>
        <div className="flex-none">
        </div>
      </div>
      <div className="relative w-full">
        {children}
      </div>
    </AuthProvider>
  );
}
