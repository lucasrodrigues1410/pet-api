import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { faker } from "@faker-js/faker";

export function makeAsset(override: Partial<Asset> = {}, id?: UniqueEntityID) {
	const asset = Asset.create(
		{
			fileId: new UniqueEntityID().toString(),
			fileType: "image/png",
			height: faker.number.int({ min: 1, max: 100 }),
			name: "animal.png",
			thumbnailUrl: faker.image.url(),
			url: faker.image.url(),
			width: faker.number.int({ min: 1, max: 100 }),
			userId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return asset;
}