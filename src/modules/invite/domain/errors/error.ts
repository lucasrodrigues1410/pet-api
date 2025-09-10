import { DomainError } from "@/core/domain/errors/domain-error";


export class InviteNotFoundError extends DomainError {
	constructor(message = "Convite não encontrado") {
		super(message);
	}
}

export class InviteExpiredError extends DomainError {
	constructor(message = "Convite expirado") {
		super(message);
	}
}

export class InviteAlreadyUsedError extends DomainError {
	constructor(message = "Convite já foi usado") {
		super(message);
	}
}
