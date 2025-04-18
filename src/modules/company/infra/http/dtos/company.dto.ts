import { z } from "zod";

export const companyDto = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string().optional(),
    contact: z.string().optional(),
})