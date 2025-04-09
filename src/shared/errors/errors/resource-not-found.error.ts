import { UseCaseError } from "../use-case-error";

export class ResourceNotFoundError extends Error implements UseCaseError {
	constructor(msg?: string) {
		super(msg ?? "Recurso não encontrado");
	}
}
