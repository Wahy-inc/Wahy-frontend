import { z } from "zod";

export const libraryItemSchema = z.object({
	title: z.string().min(1),
	external_url: z.string().url(),
	description: z.string().optional().nullable(),
	category: z.string().optional().nullable(),
	access_level: z
		.enum(["all_students", "specific_students", "groups"])
		.default("all_students"),
});

export type LibraryItemValues = z.infer<typeof libraryItemSchema>;
