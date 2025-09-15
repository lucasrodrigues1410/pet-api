import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { AnimalPresenter } from "./animal.presenter";

type AnimalWithRelations = Animal & { breed: Breed; asset?: Asset };

export class GetAnimalByIdPresenter {
	static present(animal: AnimalWithRelations) {
		return AnimalPresenter.presentWithBreedAndAsset(
			animal,
			animal.breed,
			animal.asset,
		);
	}
}
