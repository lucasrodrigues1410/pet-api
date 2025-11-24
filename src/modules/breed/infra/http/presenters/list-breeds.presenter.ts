import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { BreedPresenter } from "./breed.presenter";

export class ListBreedsPresenter {
	static present(breeds: { name: string; breeds: Breed[] }[]) {
		return {
			items: breeds.map((item) => ({
				name: item.name,
				breeds: item.breeds.map((breed) => BreedPresenter.present(breed)),
			})),
		};
	}
}
