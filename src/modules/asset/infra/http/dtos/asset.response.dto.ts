import { createZodDto } from "@anatine/zod-nestjs";
import { assetDto } from "./asset.dto";

export class AssetResponse extends createZodDto(assetDto) {}