"use client";
import { useLocalization } from "@/lib/localization-context";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangePickerProps {
	startName: string;
	endName: string;
	startLabel?: string;
	endLabel?: string;
	startValue?: string;
	endValue?: string;
	/** Called with (start, end) on either field change. */
	onChange?: (start: string, end: string) => void;
	/** Required HTML5 input type (date, datetime-local). */
	inputType?: "date" | "datetime-local";
}

export function DateRangePicker({
	startName,
	endName,
	startLabel,
	endLabel,
	startValue = "",
	endValue = "",
	onChange,
	inputType = "date",
}: DateRangePickerProps) {
	const { t } = useLocalization();
	return (
		<div className="flex flex-wrap items-end gap-3">
			<div className="flex flex-col gap-1.5">
				<Label htmlFor={startName}>{startLabel ?? t("common.start")}</Label>
				<Input
					id={startName}
					name={startName}
					type={inputType}
					value={startValue}
					onChange={(event) => onChange?.(event.target.value, endValue)}
				/>
			</div>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor={endName}>{endLabel ?? t("common.end")}</Label>
				<Input
					id={endName}
					name={endName}
					type={inputType}
					value={endValue}
					onChange={(event) => onChange?.(startValue, event.target.value)}
				/>
			</div>
		</div>
	);
}
