import { Injectable, Logger } from "@nestjs/common";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Invite } from "../../domain/entities/invite.entity";
import { InviteRepository } from "../../domain/repositories/invite.repository";

interface ValidateInviteUseCaseRequest {
	token: string;
}

type ValidateInviteUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		invite: Invite & { user: User };
		isValid: boolean;
		isExpired: boolean;
		isUsed: boolean;
	}
>;

@Injectable()
export class ValidateInviteUseCase {
	private readonly logger = new Logger(ValidateInviteUseCase.name);

	constructor(private readonly inviteRepository: InviteRepository) {}

	async execute({
		token,
	}: ValidateInviteUseCaseRequest): Promise<ValidateInviteUseCaseResponse> {
		this.logger.log(`Validating invite token: ${token}`);

		try {
			const invite = await this.inviteRepository.findByToken(token);

			if (!invite) {
				this.logger.warn(`Invite not found for token: ${token}`);
				return left(new ResourceNotFoundError("Convite não encontrado"));
			}

			const now = new Date();
			const isExpired = invite.expiresAt < now;
			const isUsed = !!invite.usedAt;
			const isValid = !isExpired && !isUsed;

			this.logger.log(
				`Invite validation result - Token: ${token}, Valid: ${isValid}, Expired: ${isExpired}, Used: ${isUsed}`,
			);

			return right({ invite, isValid, isExpired, isUsed });
		} catch (error) {
			this.logger.error(
				`Error validating invite token: ${token}`,
				(error as Error).stack,
			);
			throw error;
		}
	}
}
