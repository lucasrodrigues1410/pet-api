import { Injectable, Logger } from "@nestjs/common";
import { randomUUIDv7 } from "bun";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { UserAlreadyExistError } from "@/modules/auth/domain/errors/user-already-exists.error";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { QueueEmailUseCase } from "@/modules/email/application/use-cases/queue-email.use-case";
import { Staff, StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Invite } from "../../domain/entities/invite.entity";
import { InviteRepository } from "../../domain/repositories/invite.repository";

interface InviteEmployeeUseCaseRequest {
	name: string;
	email: string;
	companyId: string;
	inviterUserId: string;
	role: StaffRole;
}

type InviteEmployeeUseCaseResponse = Either<
	UserAlreadyExistError | ResourceNotFoundError,
	{ invite: Invite; user: User }
>;

@Injectable()
export class InviteEmployeeUseCase {
	private readonly logger = new Logger(InviteEmployeeUseCase.name);

	constructor(
		private readonly userRepository: UserRepository,
		private readonly companyRepository: CompanyRepository,
		private readonly staffRepository: StaffRepository,
		private readonly inviteRepository: InviteRepository,
		private readonly queueEmailUseCase: QueueEmailUseCase,
	) {}

	async execute({
		name,
		email,
		companyId,
		inviterUserId,
		role,
	}: InviteEmployeeUseCaseRequest): Promise<InviteEmployeeUseCaseResponse> {
		this.logger.log(
			`Executing invite employee use case for company ${companyId}`,
		);
		this.logger.debug(
			`Invite employee data: ${JSON.stringify({ name, email, companyId, inviterUserId })}`,
		);

		try {
			const company = await this.companyRepository.findById(companyId);
			if (!company) {
				this.logger.warn(`Company not found with ID: ${companyId}`);
				return left(new ResourceNotFoundError("Empresa não encontrada"));
			}

			const inviter = await this.userRepository.findById(inviterUserId);
			if (!inviter) {
				this.logger.warn(`Inviter user not found with ID: ${inviterUserId}`);
				return left(
					new ResourceNotFoundError("Usuário convidador não encontrado"),
				);
			}

			const existingUser = await this.userRepository.findByEmail(email);
			if (existingUser) {
				this.logger.warn(`User already exists with email: ${email}`);
				return left(new UserAlreadyExistError(email));
			}

			const user = User.create({
				name,
				email,
				password: randomUUIDv7().slice(0, 8),
				type: "company",
			});

			await this.userRepository.create(user);
			this.logger.log(
				`User created successfully with ID: ${user.id.toString()}`,
			);

			const staff = Staff.create({
				userId: user.id,
				companyId: new UniqueEntityID(companyId),
				role,
			});

			await this.staffRepository.create(staff);
			this.logger.log(
				`Staff record created successfully with ID: ${staff.id.toString()}`,
			);

			const expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + 7);

			const invite = Invite.create({ userId: user.id, expiresAt });

			await this.inviteRepository.create(invite);
			this.logger.log(
				`Invite created successfully with token: ${invite.token}`,
			);

			const acceptInviteUrl = `${process.env.FRONTEND_URL}/invite/accept?token=${invite.token}`;

			try {
				await this.queueEmailUseCase.executeHighPriority({
					templateKey: "employee-invite",
					target: email,
					variables: {
						employeeName: name,
						companyName: company.name,
						inviterName: inviter.name,
						token: invite.token,
						expiresAt: invite.expiresAt,
						acceptInviteUrl,
					},
				});
				this.logger.log(`Invite email queued successfully for: ${email}`);
			} catch (emailError) {
				this.logger.warn(
					`Failed to queue invite email for ${email}`,
					(emailError as Error).stack,
				);
			}

			return right({ invite, user });
		} catch (error) {
			this.logger.error(
				`Error inviting employee for company ${companyId}`,
				(error as Error).stack,
			);
			throw error;
		}
	}
}
