import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { EnvService } from "@/core/infra/env/env.service";
import { Injectable } from "@nestjs/common";
import ImageKit from "imagekit";
import {
	UploadParams,
	UploadResponse,
	Uploader,
} from "../../domain/storage/uploader";

@Injectable()
export class ImageKitStorageProvider implements Uploader {
	private client: ImageKit;

	constructor(private envService: EnvService) {
		const publicKey = envService.get("IMAGE_KIT_PUBLIC_KEY");
		const privateKey = envService.get("IMAGE_KIT_PRIVATE_KEY");
		const urlEndpoint = envService.get("IMAGE_KIT_URL_ENDPOINT");
		this.client = new ImageKit({
			publicKey,
			privateKey,
			urlEndpoint,
		});
	}

	async upload({ fileName, body }: UploadParams): Promise<UploadResponse> {
		const uploadId = new UniqueEntityID();
		const uniqueFileName = `${uploadId}-${fileName}`;

		const response = await this.client.upload({
			fileName: uniqueFileName,
			file: body,
			useUniqueFileName: true,
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
