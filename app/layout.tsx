import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./style/globals.css";
import { TokenRefresher } from "@/components/TokenRefresher";
import { PwaBootstrap } from "@/components/PwaBootstrap";
import { LocalizationProvider } from "@/lib/localization-context";
import { Footer } from "@/components/Footer";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#F1F5F9", color: "#1E293B" , display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column'}}
      >
        <LocalizationProvider>
          <PwaBootstrap />
          <TokenRefresher />
          {children}
          <Footer />
        </LocalizationProvider>
      </body>
    </html>
  );
}
