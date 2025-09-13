import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { AnimalPresenter } from "./animal.presenter";

type AnimalWithRelations = Animal & { breed: Breed; asset?: Asset };

export class ListAnimalsFromUserPresenter {
	static present(result: PaginationResult<AnimalWithRelations>) {
		return {
			items: result.items.map((animal) =>
				AnimalPresenter.presentWithBreedAndAsset(
					animal,
					animal.breed,
					animal.asset,
				),
			),
			meta: result.meta,
		};
	}
}
