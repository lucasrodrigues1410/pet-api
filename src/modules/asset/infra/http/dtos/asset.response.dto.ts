import { createZodDto } from "nestjs-zod";
import { assetDto } from "./asset.dto";

export class AssetResponse extends createZodDto(assetDto) {}
