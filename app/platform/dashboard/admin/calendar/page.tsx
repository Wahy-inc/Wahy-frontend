"use client";
import { useLocalization } from "@/lib/localization-context";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { AttendanceBadge } from "@/components/shared/status-badge";
import { ApiError } from "@/lib/api/client";
import {
	fetchIcsFeed,
	getCalendarFeed,
	getCalendarGrid,
	rotateCalendarFeed,
	updateCalendarFeed,
} from "@/lib/api/calendar";
import type { CalendarFeedRead, CalendarSlotItem } from "@/lib/data-contracts";
import { formatDateTime, formatTime, todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, addMonths, format, getDay, startOfMonth } from "date-fns";
import { dateFnsLocale } from "@/lib/i18n-locale";
import {
	CalendarClock,
	ChevronLeft,
	ChevronRight,
	Copy,
	Download,
	RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const GRID_DAYS = 42;

export default function AdminCalendarPage() {
	const { t } = useLocalization();
	const queryClient = useQueryClient();
	const [monthCursor, setMonthCursor] = useState(() =>
		startOfMonth(new Date()),
	);

	const gridStart = useMemo(() => {
		const first = startOfMonth(monthCursor);
		// Align the grid to Monday (JS getDay: 0=Sunday).
		const offset = (getDay(first) + 6) % 7;
		return addDays(first, -offset);
	}, [monthCursor]);
	const gridEnd = addDays(gridStart, GRID_DAYS - 1);
	const startDate = format(gridStart, "yyyy-MM-dd");
	const endDate = format(gridEnd, "yyyy-MM-dd");
	const today = todayISO();

	const gridQuery = useQuery({
		queryKey: ["calendar-grid", startDate, endDate],
		queryFn: () => getCalendarGrid({ startDate, endDate }),
	});

	const feedQuery = useQuery({
		queryKey: ["calendar-feed"],
		queryFn: getCalendarFeed,
	});
	const feed = feedQuery.data;

	const slotsByDate = useMemo(() => {
		const map = new Map<string, CalendarSlotItem[]>();
		for (const slot of gridQuery.data?.slots ?? []) {
			const list = map.get(slot.date) ?? [];
			list.push(slot);
			map.set(slot.date, list);
		}
		return map;
	}, [gridQuery.data]);

	const enableMutation = useMutation({
		mutationFn: (isEnabled: boolean) =>
			updateCalendarFeed({ is_enabled: isEnabled }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["calendar-feed"] });
			toast.success(t("calendar.feed_updated"));
		},
		onError: (err) =>
			toast.error(
				err instanceof ApiError
					? err.message
					: t("common.something_went_wrong"),
			),
	});

	const rotateMutation = useMutation({
		mutationFn: () => rotateCalendarFeed(),
		onSuccess: (data) => {
			queryClient.setQueryData<CalendarFeedRead>(
				["calendar-feed"],
				(current) =>
					current
						? {
								...current,
								feed_url: data.feed_url,
								last_rotated_at: data.rotated_at,
							}
						: current,
			);
			toast.success(t("calendar.token_rotated"));
		},
		onError: (err) =>
			toast.error(
				err instanceof ApiError
					? err.message
					: t("common.something_went_wrong"),
			),
	});

	const handleCopyFeedUrl = async (feedUrl: string) => {
		try {
			await navigator.clipboard.writeText(feedUrl);
			toast.success(t("calendar.url_copied"));
		} catch {
			toast.error(t("calendar.copy_failed"));
		}
	};

	const handleDownloadIcs = async (feedUrl: string) => {
		try {
			const text = await fetchIcsFeed(feedUrl);
			const blob = new Blob([text], { type: "text/calendar" });
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = "wahy-calendar.ics";
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			URL.revokeObjectURL(url);
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : t("common.something_went_wrong"),
			);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("calendar.title")}
				description={t("calendar.description")}
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => setMonthCursor((month) => addMonths(month, -1))}
							aria-label={t("calendar.previous_month")}
						>
							<ChevronLeft className="rtl:rotate-180 size-4" />
						</Button>
						<span className="min-w-32 text-center text-sm font-medium">
							{format(monthCursor, "MMMM yyyy", { locale: dateFnsLocale() })}
						</span>
						<Button
							variant="outline"
							size="icon"
							onClick={() => setMonthCursor((month) => addMonths(month, 1))}
							aria-label={t("calendar.next_month")}
						>
							<ChevronRight className="rtl:rotate-180 size-4" />
						</Button>
					</div>
				}
			/>

			<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
				<div className="flex flex-col gap-3">
					{gridQuery.error ? (
						<ErrorBanner
							message={
								gridQuery.error instanceof Error
									? gridQuery.error.message
									: t("common.something_went_wrong")
							}
						/>
					) : null}
					{gridQuery.isLoading ? (
						<LoadingSkeleton rows={6} />
					) : (
						<div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border bg-border">
							{WEEKDAY_HEADERS.map((day) => (
								<div
									key={day}
									className="bg-muted px-2 py-2 text-center text-xs font-medium"
								>
									{day}
								</div>
							))}
							{Array.from({ length: GRID_DAYS }, (_, index) => {
								const day = addDays(gridStart, index);
								const dateStr = format(day, "yyyy-MM-dd");
								const inMonth = format(day, "M") === format(monthCursor, "M");
								const slots = slotsByDate.get(dateStr) ?? [];
								return (
									<Link
										key={dateStr}
										href={`/platform/dashboard/admin/calendar/${dateStr}`}
										className={cn(
											"flex min-h-24 flex-col gap-1 bg-background p-1.5 transition-colors hover:bg-accent",
											dateStr === today && "bg-primary/5",
										)}
									>
										<span
											className={cn(
												"text-xs font-medium",
												inMonth ? "text-foreground" : "text-muted-foreground",
											)}
										>
											{format(day, "d")}
										</span>
										{slots.map((slot) => (
											<div
												key={`${slot.date}-${slot.schedule_id}-${slot.student_id}-${slot.start_time}`}
												className="flex flex-col gap-0.5"
											>
												<span className="truncate text-xs">
													{slot.student_name_en}
												</span>
												<span className="text-muted-foreground text-xs">
													{formatTime(slot.start_time)} -{" "}
													{formatTime(slot.end_time)}
												</span>
												{slot.lesson_data ? (
													<AttendanceBadge
														status={slot.lesson_data.attendance}
													/>
												) : null}
											</div>
										))}
									</Link>
								);
							})}
						</div>
					)}
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<CalendarClock className="size-4" />
							{t("calendar.feed_title")}
						</CardTitle>
						<CardDescription>{t("calendar.feed_desc")}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{feedQuery.error ? (
							<ErrorBanner
								message={
									feedQuery.error instanceof Error
										? feedQuery.error.message
										: t("common.something_went_wrong")
								}
							/>
						) : null}
						{feedQuery.isLoading ? (
							<LoadingSkeleton rows={2} />
						) : feed ? (
							<>
								<div className="flex flex-col gap-2">
									<Label>{t("calendar.feed_url")}</Label>
									<div className="flex gap-2">
										<Input
											readOnly
											value={feed.feed_url}
											className="font-mono text-xs"
										/>
										<Button
											variant="outline"
											size="icon"
											onClick={() => void handleCopyFeedUrl(feed.feed_url)}
											aria-label={t("calendar.copy_aria")}
										>
											<Copy className="size-4" />
										</Button>
									</div>
								</div>
								<div className="flex flex-wrap gap-2">
									<Button
										variant={feed.is_enabled ? "outline" : "default"}
										onClick={() => enableMutation.mutate(!feed.is_enabled)}
										disabled={enableMutation.isPending}
									>
										{feed.is_enabled
											? t("calendar.disable_feed")
											: t("calendar.enable_feed")}
									</Button>
									<Button
										variant="outline"
										onClick={() => rotateMutation.mutate()}
										disabled={rotateMutation.isPending}
									>
										<RefreshCw className="size-4" />
										{t("calendar.rotate_token")}
									</Button>
									<Button
										variant="outline"
										onClick={() => void handleDownloadIcs(feed.feed_url)}
										disabled={!feed.is_enabled}
									>
										<Download className="size-4" />
										{t("calendar.download_ics")}
									</Button>
								</div>
								<p className="text-muted-foreground text-xs">
									{feed.last_rotated_at
										? `Last rotated: ${formatDateTime(feed.last_rotated_at)}`
										: t("calendar.token_never_rotated")}
								</p>
							</>
						) : null}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
