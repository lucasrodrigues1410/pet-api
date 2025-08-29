import z from "zod";

const requestDto = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	price: z.number().min(0),
	duration: z.number().min(0),
	rules: z.string().min(1),
});

export type CreateServiceRequestDto = z.infer<typeof requestDto>;
