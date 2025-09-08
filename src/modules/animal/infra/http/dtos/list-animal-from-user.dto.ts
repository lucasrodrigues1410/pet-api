import { createZodDto } from "nestjs-zod";
import { assetDto } from "@/modules/asset/infra/http/dtos/asset.dto";
import { breedDto } from "@/modules/breed/infra/http/dtos/breed.dto";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { animalDto } from "./animal.dto";

export const responseDto = animalDto.extend({
	breed: breedDto,
	asset: assetDto.optional(),
});

export class ListAnimalFromUserResponseDto extends createZodDto(
	makePaginatedDto(responseDto),
) {}
