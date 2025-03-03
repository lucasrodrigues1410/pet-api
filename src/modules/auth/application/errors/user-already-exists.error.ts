import { UseCaseError } from "src/common/errors/use-case-error";

export class UserAlreadyExistError extends Error implements UseCaseError {
    constructor(identifier: string) {
        super(`Usuário com o identificador ${identifier} já existe`);
    }
}