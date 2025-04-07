import { UseCaseError } from "@/shared/errors/use-case-error";

export class UserAlreadyExistError extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`Usuário com o identificador ${identifier} já existe`);
	}
}
