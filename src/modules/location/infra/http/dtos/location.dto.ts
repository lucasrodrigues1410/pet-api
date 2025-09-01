import z from "zod";

export const locationDto = z.object({
	id: z.string(),
	addressLine: z.string(),
    number: z.string(),
    complement: z.string().nullable(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
});