import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import ImageKit from "imagekit";
import {
	UploadParams,
	UploadResponse,
	UploaderProvider,
} from "../../domain/storage/uploader-provider";

@Injectable()
export class ImageKitStorageProvider implements UploaderProvider {
	private client: ImageKit;

	constructor(private readonly configService: ConfigService) {
		const publicKey = this.configService.get("IMAGE_KIT_PUBLIC_KEY");
		const privateKey = this.configService.get("IMAGE_KIT_PRIVATE_KEY");
		const urlEndpoint = this.configService.get("IMAGE_KIT_URL_ENDPOINT");
		this.client = new ImageKit({
			publicKey,
			privateKey,
			urlEndpoint,
		});
	}

	async upload({ fileName, body }: UploadParams): Promise<UploadResponse> {
		const uploadId = randomUUID();
		const uniqueFileName = `${uploadId}-${fileName}`;

		const response = await this.client.upload({
			fileName: uniqueFileName,
			file: body,
			useUniqueFileName: true,
		});

		return {
			id: uploadId,
			name: response.name,
			url: response.url,
			width: response.width,
			height: response.height,
			thumbnailUrl: response.thumbnailUrl,
			metadata: response.metadata as unknown as Record<string, unknown>,
		};
	}
}
