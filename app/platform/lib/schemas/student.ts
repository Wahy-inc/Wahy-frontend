import { z } from "zod";

export const studentUpdateSchema = z.object({
	full_name_arabic: z.string().min(1),
	full_name_english: z.string().min(1),
	date_of_birth: z.string().optional().nullable(),
	timezone: z.string().min(1),
	status: z.enum(["active", "on_hold", "graduated", "inactive"]),
	lessons_per_week: z.coerce.number().int().min(1).max(14).default(2),
	base_rate: z.coerce.number().min(0).optional().nullable(),
	private_notes: z.string().optional().nullable(),
	special_notes: z.string().optional().nullable(),
});

export type StudentUpdateValues = z.infer<typeof studentUpdateSchema>;
