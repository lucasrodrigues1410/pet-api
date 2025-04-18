import { Asset } from "@/modules/asset/domain/entities/asset";
import { z } from "zod";
import { assetDto } from "../dtos/asset.dto";

export class AssetPresenter {
	static toHTTP(asset: Asset): z.infer<typeof assetDto> {
		return {
			id: asset.id.toString(),
			url: asset.url,
			thumbnailUrl: asset.thumbnailUrl,
			userId: asset.userId.toString(),
		};
	}
}
