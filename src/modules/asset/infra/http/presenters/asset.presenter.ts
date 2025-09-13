import { Asset } from "@/modules/asset/domain/entities/asset";

export class AssetPresenter {
	static present(asset: Asset) {
		return {
			id: asset.id.toString(),
			name: asset.name,
			url: asset.url,
			fileType: asset.fileType,
			width: asset.width,
			height: asset.height,
			thumbnailUrl: asset.thumbnailUrl,
			fileId: asset.fileId,
			userId: asset.userId.toString(),
		};
	}
}
