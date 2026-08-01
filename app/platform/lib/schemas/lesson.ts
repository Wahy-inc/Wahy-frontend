import { z } from "zod";

export const lessonCreateSchema = z.object({
	student_id: z.coerce.number().int().positive("Select a student"),
	schedule_id: z.coerce.number().int().positive("Select a class"),
	date: z.string().min(1),
	attendance: z
		.enum(["present", "absent", "late", "excused"])
		.default("present"),
	student_notes: z.string().optional().nullable(),
	sheikh_notes: z.string().optional().nullable(),
	what_is_heard_from_sheikh: z.string().optional().nullable(),
	homework: z.string().optional().nullable(),
});

export type LessonCreateValues = z.infer<typeof lessonCreateSchema>;

export const lessonUpdateSchema = z.object({
	date: z.string().optional().nullable(),
	attendance: z
		.enum(["present", "absent", "late", "excused"])
		.optional()
		.nullable(),
	student_notes: z.string().optional().nullable(),
	sheikh_notes: z.string().optional().nullable(),
	what_is_heard_from_sheikh: z.string().optional().nullable(),
	homework: z.string().optional().nullable(),
});

export type LessonUpdateValues = z.infer<typeof lessonUpdateSchema>;

export const rescheduleSchema = z.object({
	new_start: z.string().min(1),
	new_end: z.string().optional(),
	scope: z.enum(["this_only", "this_and_future"]).default("this_only"),
});

export type RescheduleValues = z.infer<typeof rescheduleSchema>;
