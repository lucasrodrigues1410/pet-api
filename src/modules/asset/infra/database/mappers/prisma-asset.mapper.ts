import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Prisma, Asset as PrismaAsset } from "@prisma/client";
import { Asset } from "src/modules/asset/domain/entities/asset";

export class PrismaAssetMapper {
	static toDomain(asset: PrismaAsset): Asset {
		return Asset.create(
			{
				name: asset.name,
				url: asset.url,
				fileType: asset.fileType || undefined,
				width: asset.width || undefined,
				height: asset.height || undefined,
				thumbnailUrl: asset.thumbnailUrl || undefined,
			},
			new UniqueEntityID(asset.id),
		);
	}

	static toPrisma(asset: Asset): Prisma.AssetUncheckedCreateInput {
		return {
			id: asset.id.toString(),
			name: asset.name,
			url: asset.url,
			fileType: asset.fileType,
			width: asset.width,
			height: asset.height,
			thumbnailUrl: asset.thumbnailUrl,
		};
	}
}
