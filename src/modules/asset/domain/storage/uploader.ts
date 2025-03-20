export interface UploadParams {
	fileName: string;
	fileType: string;
	body: Buffer;
}

export interface UploadResponse {
	name: string;
	url: string;
	width?: number;
	height?: number;
	thumbnailUrl?: string;
}

export abstract class Uploader {
	abstract upload(params: UploadParams): Promise<UploadResponse>;
}
