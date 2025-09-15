import { createZodDto } from "nestjs-zod";
import { assetDto } from "@/modules/asset/infra/http/dtos/asset.dto";
import { breedDto } from "@/modules/breed/infra/http/dtos/breed.dto";
import { animalDto } from "./animal.dto";

export const getAnimalByIdResponseDto = animalDto.extend({
	breed: breedDto,
	asset: assetDto.optional(),
});

export class GetAnimalByIdResponseDto extends createZodDto(
	getAnimalByIdResponseDto,
) {}
