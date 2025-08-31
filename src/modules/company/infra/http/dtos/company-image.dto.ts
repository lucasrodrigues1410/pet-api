import z from "zod";

export const companyImageDto = z.object({
	id: z.string(),
	asset: z.object({
		id: z.string(),
		url: z.string(),
		name: z.string(),
		fileType: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
	}),
});
