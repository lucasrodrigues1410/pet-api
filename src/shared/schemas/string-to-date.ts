import { z } from "zod";

export const stringToDate = z
	.union([z.iso.datetime(), z.iso.date()])
	.pipe(z.transform((str) => new Date(str)));
