import type { LucideIcon } from "lucide-react";
import {
	BarChart3,
	BookOpen,
	CalendarDays,
	CalendarClock,
	GraduationCap,
	Home,
	Inbox,
	Library,
	Receipt,
	ScrollText,
	User,
	Users,
} from "lucide-react";

export interface NavItem {
	href: string;
	label: string;
	icon: LucideIcon;
}

export const ADMIN_HOME = "/platform/dashboard/admin/home";
export const PARENT_HOME = "/platform/dashboard/parent/home";

export const adminNavItems: NavItem[] = [
	{ href: ADMIN_HOME, label: "Home", icon: Home },
	{ href: "/platform/dashboard/admin/parents", label: "Parents", icon: Users },
	{ href: "/platform/dashboard/admin/students", label: "Students", icon: GraduationCap },
	{ href: "/platform/dashboard/admin/schedules", label: "Schedules", icon: CalendarClock },
	{ href: "/platform/dashboard/admin/classes", label: "Classes", icon: BookOpen },
	{ href: "/platform/dashboard/admin/lessons", label: "Lessons", icon: ScrollText },
	{ href: "/platform/dashboard/admin/invoices", label: "Invoices", icon: Receipt },
	{ href: "/platform/dashboard/admin/library", label: "Library", icon: Library },
	{ href: "/platform/dashboard/admin/wird", label: "Wird", icon: BookOpen },
	{ href: "/platform/dashboard/admin/calendar", label: "Calendar", icon: CalendarDays },
	{ href: "/platform/dashboard/admin/analytics", label: "Analytics", icon: BarChart3 },
	{ href: "/platform/dashboard/admin/reset-requests", label: "Reset requests", icon: Inbox },
];

export const parentNavItems: NavItem[] = [
	{ href: PARENT_HOME, label: "Home", icon: Home },
	{ href: "/platform/dashboard/parent/children", label: "Children", icon: Users },
	{ href: "/platform/dashboard/parent/schedules", label: "Schedules", icon: CalendarClock },
	{ href: "/platform/dashboard/parent/classes", label: "Classes", icon: BookOpen },
	{ href: "/platform/dashboard/parent/wird", label: "Wird", icon: ScrollText },
	{ href: "/platform/dashboard/parent/library", label: "Library", icon: Library },
	{ href: "/platform/dashboard/parent/invoices", label: "Invoices", icon: Receipt },
	{ href: "/platform/dashboard/parent/profile", label: "Profile", icon: User },
];
