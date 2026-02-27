'use client'

import { AuthProvider } from '@/lib/auth-context'
import { NavBar } from '@/components/NavBar'
import React from 'react';
import { Toaster } from 'sonner';

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <AuthProvider>
      <Toaster position="top-center" />
      <NavBar />
      <div className="relative w-full">
        {children}
      </div>
    </AuthProvider>
  );
}
