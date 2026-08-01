"use client";
import { useLocalization } from "@/lib/localization-context";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBanner } from "@/components/shared/error-banner";
import { errorMessage } from "@/components/shared/error-text";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	getUpcomingSessions,
	listNotifications,
	markAllNotificationsRead,
	markNotificationRead,
} from "@/lib/api/notifications";
import {
	formatDate,
	formatDateTime,
	formatMinutesUntil,
	formatTime,
} from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Bell,
	BookOpen,
	CalendarClock,
	Check,
	Inbox,
	Receipt,
	Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const quickLinks = [
	{
		href: "/platform/dashboard/admin/parents",
		label: "Parents",
		description: "Manage parents and invite codes",
		icon: Users,
	},
	{
		href: "/platform/dashboard/admin/wird",
		label: "Wird",
		description: "Assign and review wird",
		icon: BookOpen,
	},
	{
		href: "/platform/dashboard/admin/invoices",
		label: "Invoices",
		description: "Generate and track invoices",
		icon: Receipt,
	},
	{
		href: "/platform/dashboard/admin/reset-requests",
		label: "Reset requests",
		description: "Approve password resets",
		icon: Inbox,
	},
];

export default function AdminHomePage() {
	const { t } = useLocalization();
	const queryClient = useQueryClient();

	const upcomingQuery = useQuery({
		queryKey: ["upcoming-sessions"],
		queryFn: getUpcomingSessions,
		refetchInterval: 60_000,
	});

	const notificationsQuery = useQuery({
		queryKey: ["notifications", { page: 1, perPage: 10 }],
		queryFn: () => listNotifications({ page: 1, perPage: 10 }),
	});

	const markRead = useMutation({
		mutationFn: (notificationId: number) =>
			markNotificationRead(notificationId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	const markAllRead = useMutation({
		mutationFn: () => markAllNotificationsRead(),
		onSuccess: () => {
			toast.success(t("notifications.marked_all_read"));
			void queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (err: unknown) => {
			toast.error(errorMessage(err));
		},
	});

	const upcoming = [...(upcomingQuery.data ?? [])].sort(
		(a, b) =>
			a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time),
	);
	const notifications = notificationsQuery.data?.items ?? [];
	const unreadCount = notifications.filter(
		(notification) => !notification.is_read,
	).length;

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("dashboard.title")}
				description={t("dashboard.description")}
			/>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{quickLinks.map((link) => (
					<Link key={link.href} href={link.href} className="block">
						<Card className="h-full transition-colors hover:border-primary/50">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<link.icon className="text-primary size-5" />
									{link.label}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground text-sm">
									{link.description}
								</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>

			<section className="flex flex-col gap-3">
				<h2 className="flex items-center gap-2 text-lg font-semibold">
					<CalendarClock className="size-5" />{t("home.upcoming_sessions")}</h2>
				{upcomingQuery.isLoading ? <LoadingSkeleton rows={2} /> : null}
				{upcomingQuery.isError ? (
					<ErrorBanner message={errorMessage(upcomingQuery.error)} />
				) : null}
				{upcomingQuery.isSuccess && upcoming.length === 0 ? (
					<EmptyState
						title={t("home.no_upcoming_sessions")}
						description={t("home.no_upcoming_desc")}
					/>
				) : null}
				{upcomingQuery.isSuccess && upcoming.length > 0 ? (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{upcoming.map((session) => (
							<Card
								key={`${session.schedule_id}-${session.student_id}-${session.date}`}
							>
								<CardHeader>
									<CardTitle>{session.student_name_en}</CardTitle>
									<p className="text-muted-foreground text-sm">
										{session.student_name_ar}
									</p>
								</CardHeader>
								<CardContent className="flex flex-col gap-2 text-sm">
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("common.date")}</span>
										<span>{formatDate(session.date)}</span>
									</div>
									<div className="flex items-center justify-between gap-3">
										<span className="text-muted-foreground">{t("common.time")}</span>
										<span>{formatTime(session.start_time)}</span>
									</div>
									<StatusBadge
										variant={
											session.minutes_until_start < 60 ? "success" : "secondary"
										}
									>
										{formatMinutesUntil(session.minutes_until_start, t)}
									</StatusBadge>
								</CardContent>
							</Card>
						))}
					</div>
				) : null}
			</section>

			<section className="flex flex-col gap-3">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h2 className="flex items-center gap-2 text-lg font-semibold">
						<Bell className="size-5" />
						Notifications
						{unreadCount > 0 ? <Badge>{unreadCount} unread</Badge> : null}
					</h2>
					<Button
						variant="outline"
						size="sm"
						onClick={() => markAllRead.mutate()}
						disabled={markAllRead.isPending || unreadCount === 0}
					>{t("notifications.mark_all_as_read")}</Button>
				</div>
				{notificationsQuery.isLoading ? <LoadingSkeleton rows={3} /> : null}
				{notificationsQuery.isError ? (
					<ErrorBanner message={errorMessage(notificationsQuery.error)} />
				) : null}
				{notificationsQuery.isSuccess && notifications.length === 0 ? (
					<EmptyState
						title={t("notifications.no_notifications")}
						description={t("notifications.no_notifications_desc")}
					/>
				) : null}
				{notificationsQuery.isSuccess && notifications.length > 0 ? (
					<ul className="flex flex-col gap-2">
						{notifications.map((notification) => (
							<li
								key={notification.id}
								className={cn(
									"rounded-md border p-3",
									notification.is_read
										? "bg-card"
										: "border-primary/30 bg-primary/5",
								)}
							>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="flex flex-wrap items-center gap-2 font-medium">
											{notification.title}
											{!notification.is_read ? <Badge>{t("notifications.new")}</Badge> : null}
										</p>
										{notification.body ? (
											<p className="text-muted-foreground mt-1 text-sm">
												{notification.body}
											</p>
										) : null}
										<p className="text-muted-foreground mt-1 text-xs">
											{formatDateTime(notification.created_at)}
										</p>
									</div>
									{!notification.is_read ? (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => markRead.mutate(notification.id)}
											disabled={markRead.isPending}
										>
											<Check className="size-4" />{t("notifications.read")}</Button>
									) : null}
								</div>
							</li>
						))}
					</ul>
				) : null}
			</section>
		</div>
	);
}
