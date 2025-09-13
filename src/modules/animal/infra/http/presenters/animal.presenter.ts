import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";

export class AnimalPresenter {
	static presentWithBreed(animal: Animal, breed: Breed) {
		return {
			id: animal.id.toString(),
			userId: animal.userId.toString(),
			breedId: animal.breedId.toString(),
			name: animal.name,
			age: animal.age,
			weight: animal.weight,
			assetId: animal.assetId?.toString(),
			size: animal.size,
			ageStage: animal.ageStage,
			breed: {
				id: breed.id.toString(),
				animalTypeId: breed.animalTypeId.toString(),
				name: breed.name,
			},
		};
	}

	/**
	 * Present animal data with breed and asset information
	 */
	static presentWithBreedAndAsset(animal: Animal, breed: Breed, asset?: Asset) {
		return {
			...this.presentWithBreed(animal, breed),
			asset: asset
				? {
						id: asset.id.toString(),
						name: asset.name,
						url: asset.url,
						fileType: asset.fileType,
						width: asset.width,
						height: asset.height,
						thumbnailUrl: asset.thumbnailUrl,
						fileId: asset.fileId,
						userId: asset.userId.toString(),
					}
				: undefined,
		};
	}
}
