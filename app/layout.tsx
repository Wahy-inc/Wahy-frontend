import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./style/globals.css";
import { TokenRefresher } from "@/components/TokenRefresher";
import { PwaBootstrap } from "@/components/PwaBootstrap";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wahy",
  description: "Quran Study Management System for sheikhs and students.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1E293B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#F1F5F9", color: "#1E293B" , display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column'}}
      >
        <PwaBootstrap />
        <TokenRefresher />
        {children}
      <footer className="w-full bg-slate-950 text-slate-100 text-md p-8">
        <p className="text-slate-100 pt-12 pb-2 text-5xl font-bold">Wahy.</p>
        <p className="w-[300px] opacity-70 pb-15">An islamic platform that specializes in helping sheikhs and eases their work.</p>
        <p className="text-sm text-gray-500 mt-4">
          &copy; {new Date().getFullYear()} Wahy. All rights reserved.
        </p>
      </footer>
      </body>
    </html>
  );
}
