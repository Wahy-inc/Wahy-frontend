import { z } from "zod";

export const childSchema = z.object({
	full_name_arabic: z.string().min(1),
	full_name_english: z.string().min(1),
	date_of_birth: z.string().optional().nullable(),
	timezone: z.string().min(1).default("UTC"),
	lessons_per_week: z.coerce
		.number()
		.int()
		.min(1, "At least 1 lesson per week")
		.max(14, "At most 14 lessons per week")
		.default(2),
	base_rate: z.coerce.number().min(0).optional().nullable(),
	private_notes: z.string().optional().nullable(),
	special_notes: z.string().optional().nullable(),
});

export type ChildValues = z.infer<typeof childSchema>;

export const parentCreateSchema = z.object({
	full_name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().max(20).optional().nullable(),
	private_notes: z.string().optional().nullable(),
	children: z.array(childSchema).min(1, "Add at least one child"),
});

export type ParentCreateValues = z.infer<typeof parentCreateSchema>;

export const parentUpdateSchema = z.object({
	full_name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().max(20).optional().nullable(),
	private_notes: z.string().optional().nullable(),
});

export type ParentUpdateValues = z.infer<typeof parentUpdateSchema>;

export const invoiceGenerateSchema = z.object({
	student_ids: z.array(z.number()).optional(),
	include_absent: z.boolean().default(false),
	include_late: z.boolean().default(false),
	include_excused: z.boolean().default(false),
	due_date: z.string().min(1),
	currency: z.string().max(3).default("USD"),
});

export type InvoiceGenerateValues = z.infer<typeof invoiceGenerateSchema>;
