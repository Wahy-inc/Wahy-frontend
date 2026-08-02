import { useLocalization } from "@/lib/localization-context";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	page: number;
	perPage: number;
	total: number;
	onChange: (page: number) => void;
}

export function Pagination({
	page,
	perPage,
	total,
	onChange,
}: PaginationProps) {
	const { t } = useLocalization();
	const totalPages = Math.max(1, Math.ceil(total / perPage));
	if (totalPages <= 1) {
		return null;
	}
	const from = (page - 1) * perPage + 1;
	const to = Math.min(page * perPage, total);

	return (
		<div className="flex items-center justify-between gap-4">
			<p className="text-muted-foreground text-sm">
				{from} - {to} / {total}
			</p>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					disabled={page <= 1}
					onClick={() => onChange(page - 1)}
					aria-label={t("common.previous_page")}
				>
					<ChevronLeft className="rtl:rotate-180 size-4" />
				</Button>
				<span className="text-muted-foreground text-sm">
					{page} / {totalPages}
				</span>
				<Button
					variant="outline"
					size="icon"
					disabled={page >= totalPages}
					onClick={() => onChange(page + 1)}
					aria-label={t("common.next_page")}
				>
					<ChevronRight className="rtl:rotate-180 size-4" />
				</Button>
			</div>
		</div>
	);
}
