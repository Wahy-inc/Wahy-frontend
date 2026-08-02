import { z } from "zod";

/**
 * Single form schema for both create and edit dialogs: the form always holds
 * every field, so one resolver serves both modes (see SchedulesPage).
 */
export const scheduleFormSchema = z
	.object({
		student_id: z.number().int().positive("Select a student"),
		start_time: z.string().min(1),
		end_time: z.string().min(1),
		effective_from: z.string().min(1),
		notes: z.string(),
		is_active: z.boolean(),
		cancellation_reason: z.string(),
	})
	.refine((data) => data.end_time > data.start_time, {
		message: "End time must be after start time",
		path: ["end_time"],
	});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
