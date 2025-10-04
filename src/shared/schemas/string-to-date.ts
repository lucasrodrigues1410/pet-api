import { z } from "zod";

export const stringToDate = z.codec(
  z.union([z.iso.datetime(), z.iso.date()]),
  z.date(),
  {
    decode: (isoString) => new Date(isoString),
    encode: (date) => date.toISOString(),
  }
);

