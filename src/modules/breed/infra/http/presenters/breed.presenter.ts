import { Breed } from "@/modules/breed/domain/entities/breed.entity";

export class BreedPresenter {
	static present(breed: Breed) {
		return {
			id: breed.id.toString(),
			animalTypeId: breed.animalTypeId.toString(),
			name: breed.name,
		};
	}

	static presentList(breeds: Breed[]) {
		return { items: breeds.map((breed) => this.present(breed)) };
	}
}
