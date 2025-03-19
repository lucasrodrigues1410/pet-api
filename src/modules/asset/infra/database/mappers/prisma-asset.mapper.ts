import { Prisma, Asset as PrismaAsset } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Asset } from "src/modules/asset/domain/entities/asset";

export class PrismaAssetMapper {
	static toDomain(asset: PrismaAsset): Asset {
		return Asset.create(
			{
				name: asset.name,
				url: asset.url,
				format: asset.format || undefined,
				alt: asset.alt || undefined,
				width: asset.width || undefined,
				height: asset.height || undefined,
				thumbnailUrl: asset.thumbnailUrl || undefined,
				metadata: (asset.metadata as Record<string, unknown>) || undefined,
			},
			new UniqueEntityID(asset.id),
		);
	}

	static toPersistence(asset: Asset): Prisma.AssetUncheckedCreateInput {
		return {
			id: asset.id.toString(),
			name: asset.name,
			url: asset.url,
			format: asset.format,
			alt: asset.alt,
			width: asset.width,
			height: asset.height,
			thumbnailUrl: asset.thumbnailUrl,
			metadata: asset.metadata as Prisma.JsonObject,
		};
	}
}
