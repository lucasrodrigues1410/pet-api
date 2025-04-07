import { UseCaseError } from "@/shared/errors/use-case-error";

export class InvalidAssetTypeError extends Error implements UseCaseError {
	constructor(type: string) {
		super(`File type "${type}" is not valid.`);
	}
}
