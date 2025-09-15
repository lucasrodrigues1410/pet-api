import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { BreedPresenter } from "./breed.presenter";

export class ListBreedsPresenter {
	static present(breeds: Breed[]) {
		return BreedPresenter.presentList(breeds);
	}
}
