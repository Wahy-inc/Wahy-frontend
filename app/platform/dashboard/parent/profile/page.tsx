"use client";

import { ErrorBanner } from "@/components/shared/error-banner";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { StudentStatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { errorMessage } from "@/components/shared/error-text";
import { getMyProfile } from "@/lib/api/parents";
import { useLocalization } from "@/lib/localization-context";
import { useQuery } from "@tanstack/react-query";
import { Info } from "lucide-react";
import Link from "next/link";
import type { StudentStatus } from "@/lib/data-contracts";

export default function ParentProfilePage() {
	const { t } = useLocalization();
	const {
		data: profile,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["my-parent"],
		queryFn: getMyProfile,
	});

	if (isLoading) {
		return <LoadingSkeleton rows={5} />;
	}
	if (isError) {
		return <ErrorBanner message={errorMessage(error)} />;
	}
	if (!profile) {
		return null;
	}

	const details = [
		{ label: t("profile.full_name"), value: profile.full_name },
		{ label: t("profile.email"), value: profile.email },
		{
			label: t("profile.phone"),
			value: profile.phone || t("common.not_provided"),
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title={t("profile.title")}
				description={t("profile.account_desc")}
			/>

			<div className="bg-muted/50 flex items-start gap-2 rounded-md border px-3 py-2 text-sm">
				<Info className="text-muted-foreground mt-0.5 size-4 shrink-0" />
				<p className="text-muted-foreground">{t("profile.read_only")}</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t("profile.account")}</CardTitle>
				</CardHeader>
				<CardContent>
					<dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
						{details.map((detail) => (
							<div
								key={detail.label}
								className="flex items-center justify-between gap-4 border-b pb-2"
							>
								<dt className="text-muted-foreground">{detail.label}</dt>
								<dd className="text-end">{detail.value}</dd>
							</div>
						))}
					</dl>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>{t("children.title")}</CardTitle>
				</CardHeader>
				<CardContent>
					{profile.children.length === 0 ? (
						<p className="text-muted-foreground text-sm">
							{t("children.no_children_linked")}
						</p>
					) : (
						<ul className="flex flex-col gap-2">
							{profile.children.map((child) => (
								<li key={child.id}>
									<Link
										href={`/platform/dashboard/parent/children/${child.id}`}
										className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm transition-colors hover:border-primary/50"
									>
										<span className="font-medium">
											{child.full_name_english}
										</span>
										<StudentStatusBadge
											status={child.status as StudentStatus}
										/>
									</Link>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
