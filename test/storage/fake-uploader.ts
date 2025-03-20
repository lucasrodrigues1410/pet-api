import {
	UploadParams,
	UploadResponse,
	Uploader,
} from "@/modules/asset/domain/storage/uploader";
import { faker } from "@faker-js/faker";
import { uuidv7 } from "uuidv7";

interface Upload {
	fileName: string;
	url: string;
}

export class FakeUploader implements Uploader {
	public uploads: Upload[] = [];

	async upload({ fileName }: UploadParams): Promise<UploadResponse> {
		const url = faker.internet.url();

		this.uploads.push({
			fileName,
			url,
		});

		return { url, name: fileName };
	}
}
