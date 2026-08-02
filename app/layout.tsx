import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./style/globals.css";
import { Providers } from "@/lib/providers";

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
	description: "Quran study management for sheikhs and parents.",
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
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem("wahy-theme");var d=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
					}}
				/>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
