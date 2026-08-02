import { useLocalization } from "@/lib/localization-context";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
	/** Number of skeleton rows to render. */
	rows?: number;
}

export function LoadingSkeleton({ rows = 5 }: LoadingSkeletonProps) {
	const { t } = useLocalization();
	return (
		<div className="flex flex-col gap-3" aria-busy="true" aria-label={t("common.loading")}>
			{Array.from({ length: rows }, (_, index) => (
				<Skeleton key={index} className="h-16 w-full" />
			))}
		</div>
	);
}
