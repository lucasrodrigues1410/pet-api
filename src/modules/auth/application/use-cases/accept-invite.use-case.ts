import { Injectable } from "@nestjs/common";
import { DomainError } from "@/core/domain/errors/domain-error";
import {
	InviteAlreadyUsedError,
	InviteExpiredError,
	InviteNotFoundError,
} from "@/modules/invite/domain/errors/error";
import { InviteRepository } from "@/modules/invite/domain/repositories/invite.repository";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { HashGenerator } from "../../domain/interfaces/hash-generator.interface";
import { SignInUseCase } from "./sign-in.use-case";

interface AcceptInviteUseCaseRequest {
	token: string;
	password: string;
}

type AcceptInviteUseCaseResponse = Either<
	DomainError,
	{ user: User; accessToken: string; staffRole?: StaffRole; companyId?: string }
>;

@Injectable()
export class AcceptInviteUseCase {
	constructor(
		private readonly inviteRepository: InviteRepository,
		private readonly userRepository: UserRepository,
		private readonly signInUseCase: SignInUseCase,
		private readonly hashGenerator: HashGenerator,
	) {}

	async execute({
		token,
		password,
	}: AcceptInviteUseCaseRequest): Promise<AcceptInviteUseCaseResponse> {
		const now = new Date();
		const invite = await this.inviteRepository.findByToken(token);
		if (!invite) throw new InviteNotFoundError();

		if (invite.isExpired(now)) throw new InviteExpiredError();
		if (invite.isUsed()) throw new InviteAlreadyUsedError();

		const user = await this.userRepository.findById(invite.userId.toString());
		if (!user) throw new ResourceNotFoundError();

		const hashedPassword = await this.hashGenerator.hash(password);
		await this.userRepository.update(user.id.toString(), {
			password: hashedPassword,
		});

		const marked = await this.inviteRepository.markAsUsedIfUnused(
			invite.id.toString(),
			now,
		);
		if (!marked) throw new InviteAlreadyUsedError();

		const signInResp = await this.signInUseCase.execute({
			email: user.email,
			password,
			type: "company",
		});

		if (signInResp.isLeft()) return left(signInResp.value);

		return right({
			user: signInResp.value,
			accessToken: signInResp.value.accessToken,
			staffRole: signInResp.value.staffRole,
			companyId: signInResp.value.companyId,
		});
	}
}
