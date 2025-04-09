import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Asset, AssetProps } from "@/modules/asset/domain/entities/asset";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";

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

@Injectable()
export class AssetFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAsset(data: Partial<AssetProps> = {}): Promise<Asset> {
		const asset = makeAsset(data);

		await this.prisma.asset.create({
			data: PrismaAssetMapper.toPrisma(asset),
		});

		return asset;
	}
}
