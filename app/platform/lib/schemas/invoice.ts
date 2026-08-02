import { z } from "zod";

export const invoicePaidSchema = z.object({
	paid_date: z.string().min(1),
	payment_method: z.string().max(50).optional().nullable(),
	payment_reference: z.string().max(255).optional().nullable(),
	payment_notes: z.string().optional().nullable(),
});

export type InvoicePaidValues = z.infer<typeof invoicePaidSchema>;

export const invoiceOverrideSchema = z.object({
	billable: z.boolean(),
	override_reason: z.string().min(3).max(255),
});

export type InvoiceOverrideValues = z.infer<typeof invoiceOverrideSchema>;
