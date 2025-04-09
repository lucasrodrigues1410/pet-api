import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	UploadParams,
	UploadResponse,
	Uploader,
} from "@/modules/asset/domain/storage/uploader";
import { faker } from "@faker-js/faker";

interface Upload {
	fileName: string;
	url: string;
	id: string;
}

export class MockUploader implements Uploader {
	public items: Upload[] = [];

	async upload({ fileName }: UploadParams): Promise<UploadResponse> {
		const url = faker.internet.url();
		const id = new UniqueEntityID();

		this.items.push({
			fileName,
			url,
			id: id.toString(),
		});

		return { url, name: fileName, id: id.toString() };
	}

	async delete(fileId: string): Promise<void> {
		const index = this.items.findIndex((upload) => upload.fileName === fileId);
		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}
}
