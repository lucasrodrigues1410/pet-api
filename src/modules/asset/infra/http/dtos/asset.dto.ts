import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const assetDto = z.object({
	id: z.string(),
	url: z.string(),
	name: z.string(),
});

export class AssetResponseDto extends createZodDto(assetDto) {}
