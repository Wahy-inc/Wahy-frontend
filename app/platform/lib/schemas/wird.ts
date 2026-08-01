import { z } from "zod";

export const wirdCreateSchema = z.object({
	student_id: z.coerce.number().int().positive("Select a student"),
	title: z.string().min(1).max(255),
	surah_name: z.string().optional().nullable(),
	ayah_from: z.coerce.number().int().min(1).optional().nullable(),
	ayah_to: z.coerce.number().int().min(1).optional().nullable(),
	due_date: z.string().optional().nullable(),
	notes: z.string().optional().nullable(),
});

export type WirdCreateValues = z.infer<typeof wirdCreateSchema>;

export const wirdUpdateSchema = wirdCreateSchema.partial();

export type WirdUpdateValues = z.infer<typeof wirdUpdateSchema>;

export const wirdReviewSchema = z.object({
	verification_notes: z.string().optional().nullable(),
});

export type WirdReviewValues = z.infer<typeof wirdReviewSchema>;

export const wirdCompletionSchema = z.object({
	submitted_notes: z.string().optional().nullable(),
});

export type WirdCompletionValues = z.infer<typeof wirdCompletionSchema>;
