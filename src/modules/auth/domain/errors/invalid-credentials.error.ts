import { UseCaseError } from "@/shared/errors/use-case-error";

export class InvalidCredentialsError extends Error implements UseCaseError {
	constructor() {
		super("Credenciais inválidas");
	}
}
