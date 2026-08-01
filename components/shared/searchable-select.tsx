"use client";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

export interface SearchableSelectOption {
	value: string;
	label: string;
}

interface SearchableSelectProps {
	value: string | undefined;
	onValueChange: (value: string) => void;
	options: SearchableSelectOption[];
	/** Placeholder shown when nothing is selected. */
	placeholder?: string;
	/** Placeholder for the search input. */
	searchPlaceholder?: string;
	/** Message shown when the search has no matches. */
	emptyText?: string;
	disabled?: boolean;
	className?: string;
}

/**
 * Combobox for long option lists (students, parents, ...): type to filter,
 * click or arrow-key to select. API-compatible with the value/onValueChange
 * shape of a Radix Select, so it drops into RHF Controller fields.
 */
export function SearchableSelect({
	value,
	onValueChange,
	options,
	placeholder = "Select...",
	searchPlaceholder = "Search...",
	emptyText = "No results found",
	disabled = false,
	className,
}: SearchableSelectProps) {
	const [open, setOpen] = useState(false);
	const selected = options.find((option) => option.value === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className={cn(
						"h-9 w-full justify-between bg-background font-normal",
						!selected && "text-muted-foreground",
						className,
					)}
				>
					<span className="truncate">
						{selected ? selected.label : placeholder}
					</span>
					<ChevronsUpDown className="size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="w-(--radix-popover-trigger-width) p-0"
				align="start"
			>
				<Command>
					<CommandInput placeholder={searchPlaceholder} />
					<CommandList>
						<CommandEmpty>{emptyText}</CommandEmpty>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.value}
									onSelect={(selectedValue) => {
										onValueChange(selectedValue);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											"size-4",
											value === option.value ? "opacity-100" : "opacity-0",
										)}
									/>
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
