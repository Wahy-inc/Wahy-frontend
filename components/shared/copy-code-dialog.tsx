"use client";
import { useLocalization } from "@/lib/localization-context";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyCodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	/** The code to display and copy (e.g. "ABCD-EFGH"). */
	code: string;
	/** Optional expiry line rendered under the code. */
	expiresAt?: string;
	expiresLabel?: string;
}

export function CopyCodeDialog({
	open,
	onOpenChange,
	title,
	description,
	code,
	expiresAt,
	expiresLabel,
}: CopyCodeDialogProps) {
	const { t } = useLocalization();
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col items-center gap-2 py-2">
					<div className="bg-muted rounded-md px-6 py-3 font-mono text-xl tracking-widest">
						{code}
					</div>
					{expiresAt ? (
						<p className="text-muted-foreground text-sm">
							{expiresLabel ?? t("common.expires")}: {expiresAt}
						</p>
					) : null}
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>{t("common.close")}</Button>
					<Button onClick={() => void handleCopy()}>
						{copied ? <Check className="size-4" /> : <Copy className="size-4" />}
						{copied ? t("common.copied") : t("calendar.copy_button")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
