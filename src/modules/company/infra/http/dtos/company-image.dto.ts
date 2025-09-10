import z from "zod";
import { assetDto } from "@/modules/asset/infra/http/dtos/asset.dto";

export const companyImageDto = z.object({ id: z.string(), asset: assetDto });
