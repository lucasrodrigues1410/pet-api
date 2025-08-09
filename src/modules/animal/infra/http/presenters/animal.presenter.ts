import { differenceInYears } from "date-fns";
import { z } from "zod";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { animalDto } from "../dtos/animal.dto";

export class AnimalPresenter {
	static toHTTP(animal: Animal): z.infer<typeof animalDto> {
		return {
			id: animal.id.toString(),
			name: animal.name,
			age: animal.birthdate
				? differenceInYears(new Date(), animal.birthdate)
				: undefined,
			weight: animal.weight ?? undefined,
			userId: animal.userId.toString(),
			assetId: animal.asset?.id.toString(),
			breedId: animal.breed?.id.toString(),
		};
	}
}
