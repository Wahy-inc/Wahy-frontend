"use client";
import { useLocalization } from "@/lib/localization-context";

import { LanguageSelect } from "@/components/dashboard/language-select";
import {
	adminNavItems,
	parentNavItems,
	type NavItem,
} from "@/components/dashboard/nav-items";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/session-context";
import { cn } from "@/lib/utils";
import { LogOut, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

interface AppShellProps {
	role: "sheikh" | "parent";
	children: ReactNode;
}

function isActive(href: string, pathname: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}

function NavList({
	items,
	pathname,
	onNavigate,
}: {
	items: NavItem[];
	pathname: string;
	onNavigate?: () => void;
}) {
	return (
		<nav className="flex flex-1 flex-col gap-1 px-3 py-4">
			{items.map((item) => {
				const active = isActive(item.href, pathname);
				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={onNavigate}
						className={cn(
							"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
							active
								? "bg-primary/10 text-primary"
								: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
						)}
					>
						<item.icon className="size-4 shrink-0" />
						{item.label}
					</Link>
				);
			})}
		</nav>
	);
}

function Sidebar({
	role,
	pathname,
	onNavigate,
}: {
	role: "sheikh" | "parent";
	pathname: string;
	onNavigate?: () => void;
}) {
	const { t } = useLocalization();
	const items = role === "sheikh" ? adminNavItems : parentNavItems;
	return (
		<div className="bg-card flex h-full flex-col border-s">
			<div className="flex items-center gap-2 px-5 py-4">
				<Image
					src="/quran.png"
					alt="Wahy"
					width={28}
					height={28}
					className="rounded"
				/>
				<span className="text-lg font-semibold">{t("navbar.brand")}</span>
			</div>
			<Separator />
			<NavList items={items} pathname={pathname} onNavigate={onNavigate} />
		</div>
	);
}

export function AppShell({ role, children }: AppShellProps) {
	const { t } = useLocalization();
	const pathname = usePathname();
	const router = useRouter();
	const { session, signOut } = useSession();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleSignOut = async () => {
		await signOut();
		router.replace("/");
	};

	return (
		<div className="flex min-h-screen">
			{/* Desktop sidebar */}
			<aside className="bg-card sticky top-0 hidden h-screen w-64 shrink-0 border-s md:block">
				<Sidebar role={role} pathname={pathname} />
			</aside>

			{/* Mobile sidebar */}
			{mobileOpen ? (
				<div className="fixed inset-0 z-50 md:hidden">
					<div
						className="absolute inset-0 bg-black/50"
						onClick={() => setMobileOpen(false)}
					/>
					<aside className="bg-card absolute inset-y-0 start-0 w-72 border-s shadow-lg">
						<Button
							variant="ghost"
							size="icon"
							className="absolute top-3 end-3"
							onClick={() => setMobileOpen(false)}
							aria-label={t("navbar.close_menu")}
						>
							<X className="size-4" />
						</Button>
						<Sidebar
							role={role}
							pathname={pathname}
							onNavigate={() => setMobileOpen(false)}
						/>
					</aside>
				</div>
			) : null}

			<div className="flex min-w-0 flex-1 flex-col">
				<header className="bg-background/80 sticky top-0 z-40 flex items-center justify-between gap-4 border-b px-4 py-3 backdrop-blur sm:px-6">
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setMobileOpen(true)}
							aria-label={t("navbar.open_menu")}
						>
							<Menu className="size-5" />
						</Button>
						<span className="text-muted-foreground truncate text-sm">
							{session?.email ?? ""}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<LanguageSelect />
						<ThemeToggle />
						<Button
							variant="ghost"
							size="icon"
							onClick={() => void handleSignOut()}
							aria-label={t("navbar.sign_out")}
						>
							<LogOut className="size-4" />
						</Button>
					</div>
				</header>
				<main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
			</div>
		</div>
	);
}
