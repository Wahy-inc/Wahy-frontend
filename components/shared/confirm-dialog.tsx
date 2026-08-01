"use client";
import { useLocalization } from "@/lib/localization-context";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
	trigger: ReactNode;
	title: string;
	description?: string;
	confirmLabel?: string;
	destructive?: boolean;
	onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
	trigger,
	title,
	description,
	confirmLabel,
	destructive = false,
	onConfirm,
}: ConfirmDialogProps) {
	const { t } = useLocalization();
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
					<AlertDialogAction
						variant={destructive ? "destructive" : "default"}
						onClick={() => void onConfirm()}
					>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
