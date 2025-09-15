import { Injectable } from "@nestjs/common";
import ImageKit from "imagekit";
import { EnvService } from "@/core/infra/env/env.service";
import {
	Uploader,
	UploadParams,
	UploadResponse,
} from "../../domain/storage/uploader";

@Injectable()
export class ImageKitStorageProvider implements Uploader {
	private client: ImageKit;

	constructor(private envService: EnvService) {
		const publicKey = this.envService.get("IMAGE_KIT_PUBLIC_KEY");
		const privateKey = this.envService.get("IMAGE_KIT_PRIVATE_KEY");
		const urlEndpoint = this.envService.get("IMAGE_KIT_URL_ENDPOINT");
		this.client = new ImageKit({ publicKey, privateKey, urlEndpoint });
	}

	async upload({
		fileName,
		body,
		folder,
	}: UploadParams): Promise<UploadResponse> {
		const uniqueFileName = `${fileName}`;

		const response = await this.client.upload({
			fileName: uniqueFileName,
			file: body,
			useUniqueFileName: false,
			overwriteFile: true,
			folder,
		});

		return {
			id: response.fileId,
			name: response.name,
			url: response.url,
			width: response.width,
			height: response.height,
			thumbnailUrl: response.thumbnailUrl,
		};
	}

	async delete(fileId: string): Promise<void> {
		await this.client.deleteFile(fileId);
	}
}
