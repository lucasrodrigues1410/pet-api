import { Injectable, Logger } from "@nestjs/common";
import { InviteRepository } from "@/modules/invite/domain/repositories/invite.repository";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { HashGenerator } from "../../domain/interfaces/hash-generator.interface";
import {
	SignInUseCase,
} from "./sign-in.use-case";

interface AcceptInviteUseCaseRequest {
	token: string;
	password: string;
}

type AcceptInviteUseCaseResponse = Either<
	ResourceNotFoundError,
	User & {
		accessToken: string;
		staffRole?: StaffRole;
		companyId?: string;
	}
>;

@Injectable()
export class AcceptInviteUseCase {
	private readonly logger = new Logger(AcceptInviteUseCase.name);

	constructor(
		private readonly inviteRepository: InviteRepository,
		private readonly signInUseCase: SignInUseCase,
		private readonly userRepository: UserRepository,
		private readonly hashGenerator: HashGenerator,
	) {}

	async execute({
		token,
		password,
	}: AcceptInviteUseCaseRequest): Promise<AcceptInviteUseCaseResponse> {
		this.logger.log(`Accepting invite with token: ${token}`);

		try {
			// Buscar o convite pelo token
			const invite = await this.inviteRepository.findByToken(token);
			if (!invite) {
				this.logger.warn(`Invite not found for token: ${token}`);
				return left(new ResourceNotFoundError("Convite não encontrado"));
			}

			// Verificar se o convite é válido
			const now = new Date();
			if (invite.expiresAt < now) {
				this.logger.warn(`Invite expired for token: ${token}`);
				return left(new ResourceNotFoundError("Convite expirado"));
			}

			if (invite.usedAt) {
				this.logger.warn(`Invite already used for token: ${token}`);
				return left(new ResourceNotFoundError("Convite já foi usado"));
			}

			// Buscar o usuário associado ao convite
			const user = await this.userRepository.findById(invite.userId.toString());
			if (!user) {
				this.logger.error(
					`User not found for invite: ${invite.userId.toString()}`,
				);
				return left(new ResourceNotFoundError("Usuário não encontrado"));
			}

			// Hashear a nova senha
			const hashedPassword = await this.hashGenerator.hash(password);

			// Atualizar o usuário com a nova senha
			user.update({ password: hashedPassword });
			await this.userRepository.update(user);

			this.logger.log(
				`User password updated successfully: ${user.id.toString()}`,
			);

			// Marcar o convite como usado
			invite.markAsUsed();
			await this.inviteRepository.update(invite.id.toString(), invite);

			this.logger.log(`Invite marked as used: ${token}`);

			const signInUseCaseResponse =
				await this.signInUseCase.execute({
					email: user.email,
					password,
					type: "company",
				});

			this.logger.log(`Invite accepted successfully for user: ${user.email}`);

			if (signInUseCaseResponse.isLeft()) {
				this.logger.error(`Error signing in on company: ${signInUseCaseResponse.value}`);
				return left(signInUseCaseResponse.value);
			}

			return right(signInUseCaseResponse.value);
		} catch (error) {
			this.logger.error(
				`Error accepting invite with token: ${token}`,
				(error as Error).stack,
			);
			return left(new Error("Error accepting invite"));
		}
	}
}
