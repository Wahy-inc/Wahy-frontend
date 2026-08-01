import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { forwardRef } from "react";

interface FieldTextareaProps extends ComponentProps<typeof Textarea> {
	label: string;
	/** Error message shown under the field; also marks the textarea invalid. */
	error?: string;
	required?: boolean;
}

export const FieldTextarea = forwardRef<
	HTMLTextAreaElement,
	FieldTextareaProps
>(function FieldTextarea(
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
				<Textarea
					ref={ref}
					id={inputId}
					aria-invalid={error ? true : undefined}
					className={cn("min-h-[80px]", className)}
					{...props}
				/>
				<FieldError className="text-xs">{error}</FieldError>
			</FieldContent>
		</Field>
	);
});
