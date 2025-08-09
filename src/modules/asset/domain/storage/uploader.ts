export interface UploadParams {
	fileName: string;
	fileType: string;
	body: Buffer;
	folder?: string;
}

export interface UploadResponse {
	id: string;
	name: string;
	url: string;
	width?: number;
	height?: number;
	thumbnailUrl?: string;
}

export abstract class Uploader {
	abstract upload(params: UploadParams): Promise<UploadResponse>;
	abstract delete(fileId: string): Promise<void>;
}
