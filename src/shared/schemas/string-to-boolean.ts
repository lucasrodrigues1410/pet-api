import { z } from "zod";

export const stringToBoolean = z
	.union([
		z.literal("true"),
		z.literal("false"),
		z.literal("1"),
		z.literal("0"),
	])
	.pipe(z.transform((str) => ["true", "1"].includes(str)));
