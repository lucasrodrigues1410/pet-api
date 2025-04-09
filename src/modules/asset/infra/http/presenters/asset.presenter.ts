import { Asset } from "@/modules/asset/domain/entities/asset";

export class AssetPresenter {
    static toHTTP(asset: Asset) {
        return {
            id: asset.id.toString(),
            url: asset.url,
            thumbnailUrl: asset.thumbnailUrl,
            userId: asset.userId.toString(),
        };
    }
}