import { z } from "zod";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { breedDto } from "../dtos/breed.dto";

export class BreedPresenter {
	static toHTTP(breed: Breed): z.infer<typeof breedDto> {
		return {
			animalTypeId: breed.animalTypeId.toString(),
			name: breed.name,
		};
	}
}
