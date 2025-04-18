import { z } from "zod";

export const categoryDto = z.object({
    id: z.string(),
    email: z.string(),
    description: z.string().optional(),
    type: z.enum(["PETSHOP"]),
});