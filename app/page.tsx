"use client";

import { LanguageSelect } from "@/components/dashboard/language-select";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { useLocalization } from "@/lib/localization-context";
import { useSession } from "@/lib/session-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import logo from "../public/quran.png";

export default function Home() {
	const router = useRouter();
	const { session, isLoading } = useSession();
	const { t } = useLocalization();

	useEffect(() => {
		if (isLoading) {
			return;
		}
		if (session?.role === "sheikh") {
			router.replace("/platform/dashboard/admin/home");
		} else if (session?.role === "parent") {
			router.replace("/platform/dashboard/parent/home");
		}
	}, [isLoading, session, router]);

	return (
		<div className="flex min-h-screen w-full flex-col bg-zinc-50 dark:bg-black">
			<div className="absolute top-4 end-4 z-10 flex items-center gap-2">
				<LanguageSelect />
				<ThemeToggle />
			</div>
			<main className="flex min-h-screen flex-col items-start justify-between px-16 py-32 lg:items-start">
				<Image
					className="dark:invert"
					src={logo}
					alt={t("navbar.brand")}
					width={100}
					height={20}
					priority
				/>
				<div className="flex flex-col items-center gap-6 text-start sm:items-start sm:text-start">
					<h1 className="max-w-xs text-5xl font-semibold leading-10 tracking-tight text-slate-900 lg:text-[100px] dark:text-zinc-50">
						{t("home.title")}
					</h1>
					<p className="max-w-md mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
						{t("home.description")}
					</p>
				</div>
				<div className="flex flex-col justify-between gap-4 text-base font-medium lg:flex-row">
					<Button
						className="h-12 rounded-full bg-slate-900 px-5 text-slate-100 transition-colors hover:bg-slate-800 hover:border-slate-800 hover:text-slate-100 md:h-20 md:w-75"
						onClick={() => router.push("/platform/auth/signin")}
					>
						Sign in
					</Button>
					<Button
						variant="outline"
						className="flex h-12 items-center justify-center rounded-full border border-solid border-slate-900 px-5 text-slate-900 transition-colors hover:bg-black/4 dark:border-zinc-300 dark:text-zinc-300 dark:hover:bg-white/10 md:h-20 md:w-75"
						onClick={() => router.push("/platform/auth/activate")}
					>
						Activate account
					</Button>
				</div>
			</main>
		</div>
	);
}
