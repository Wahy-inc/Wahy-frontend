"use client";
import { useLocalization } from "@/lib/localization-context";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getMyChildren } from "@/lib/api/parents";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactElement } from "react";
import type { ChildRead } from "@/lib/data-contracts";

const ALL_VALUE = "all";

interface UseChildFilterOptions {
	/** Show an "All children" option and select it by default. Defaults to true. */
	allowAll?: boolean;
	/** Called whenever the selected child changes. Use to reset dependent state. */
	onStudentChange?: (studentId: number | undefined) => void;
}

export interface ChildFilter {
	children: ChildRead[];
	/** Selected student id, or undefined for "All children". */
	studentId: number | undefined;
	/** Whether the children query is still loading. */
	isLoading: boolean;
	/** Renders the child filter select. */
	childSelect: ReactElement;
}

/**
 * Shared child filter for parent portal pages. Fetches the parent's children
 * once (query key ["my-children"]) and renders a select that drives the
 * `student_id` argument of the `/me` endpoints. When `allowAll` is false the
 * first child is selected until the parent picks another one explicitly.
 */
export function useChildFilter(options: UseChildFilterOptions = {}): ChildFilter {
	const { t } = useLocalization();
	const { allowAll = true, onStudentChange } = options;
	const { data: children = [], isLoading } = useQuery({
		queryKey: ["my-children"],
		queryFn: getMyChildren,
	});
	const [studentId, setStudentId] = useState<number | undefined>(undefined);

	const effectiveStudentId = allowAll ? undefined : (studentId ?? children[0]?.id);

	const handleChange = (value: string) => {
		const next = value === ALL_VALUE ? undefined : Number(value);
		setStudentId(next);
		onStudentChange?.(next);
	};

	const childSelect = (
		<Select
			value={
				effectiveStudentId !== undefined ? String(effectiveStudentId) : allowAll ? ALL_VALUE : undefined
			}
			onValueChange={handleChange}
			disabled={isLoading}
		>
			<SelectTrigger className="w-[220px]" aria-label={t("children.filter_aria")}>
				<SelectValue placeholder={t("children.select_child")} />
			</SelectTrigger>
			<SelectContent>
				{allowAll ? <SelectItem value={ALL_VALUE}>{t("children.all")}</SelectItem> : null}
				{children.map((child) => (
					<SelectItem key={child.id} value={String(child.id)}>
						{child.full_name_english}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);

	return { children, studentId: effectiveStudentId, childSelect, isLoading };
}
