import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
	title: string;
	description?: string;
	icon?: LucideIcon;
	/** Optional action button rendered below the copy. */
	action?: ReactNode;
}

export function EmptyState({
	title,
	description,
	icon: Icon = Inbox,
	action,
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
			<div className="bg-muted mb-2 flex size-12 items-center justify-center rounded-full">
				<Icon className="text-muted-foreground size-6" />
			</div>
			<p className="font-medium">{title}</p>
			{description ? (
				<p className="text-muted-foreground max-w-sm text-sm">{description}</p>
			) : null}
			{action ? <div className="mt-2">{action}</div> : null}
		</div>
	);
}
