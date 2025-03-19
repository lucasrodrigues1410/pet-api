export interface UploadParams {
	fileName: string;
	fileType: string;
	body: Buffer;
}

export interface UploadResponse {
	id: string;
	name: string;
	url: string;
	width?: number;
	height?: number;
	thumbnailUrl?: string;
	formats?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export abstract class UploaderProvider {
	abstract upload(params: UploadParams): Promise<UploadResponse>;
}
