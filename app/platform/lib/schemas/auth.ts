import { z } from "zod";

export const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const activateSchema = z
	.object({
		code: z.string().min(7).max(16),
		new_password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(128),
		confirm_password: z.string(),
	})
	.refine((data) => data.new_password === data.confirm_password, {
		message: "Passwords do not match",
		path: ["confirm_password"],
	});

export type ActivateValues = z.infer<typeof activateSchema>;

export const resetRequestSchema = z.object({
	identifier: z.string().min(1),
});

export type ResetRequestValues = z.infer<typeof resetRequestSchema>;
