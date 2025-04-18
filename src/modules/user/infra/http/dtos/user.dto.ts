import { z } from "zod";

export const userDto = z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    type: z.enum(["CUSTOMER", "COMPANY", "ADMIN"]),
});