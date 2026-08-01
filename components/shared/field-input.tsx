import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

interface FieldInputProps extends ComponentProps<typeof Input> {
	label: string;
	/** Error message shown under the field; also marks the input invalid. */
	error?: string;
	required?: boolean;
}

export const FieldInput = forwardRef<HTMLInputElement, FieldInputProps>(
	function FieldInput(
		{ label, error, required, id, className, ...props },
		ref,
	) {
		const inputId = id ?? props.name;
		return (
			<Field className="gap-1.5">
				<FieldLabel htmlFor={inputId}>
					{label}
					{required ? <span className="text-destructive">*</span> : null}
				</FieldLabel>
				<FieldContent>
					<Input
						ref={ref}
						id={inputId}
						aria-invalid={error ? true : undefined}
						className={className}
						{...props}
					/>
					<FieldError className="text-xs">{error}</FieldError>
				</FieldContent>
			</Field>
		);
	},
);
