import { Injectable, Logger } from "@nestjs/common";
import { randomUUIDv7 } from "bun";
import { UserAlreadyExistError } from "@/modules/auth/domain/errors/user-already-exists.error";
import { EmployeeInviteEvent } from "@/modules/notification/domain/events/employee-invite.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
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
	userId: string;
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
		private readonly staffRepository: StaffRepository,
		private readonly inviteRepository: InviteRepository,
		private readonly notifyPublisher: NotificationPublisher,
	) {}

	async execute({
		name,
		email,
		userId,
		inviterUserId,
		role,
	}: InviteEmployeeUseCaseRequest): Promise<InviteEmployeeUseCaseResponse> {
		this.logger.log(`Executing invite employee use case for user ${userId}`);
		this.logger.debug(
			`Invite employee data: ${JSON.stringify({ name, email, userId, inviterUserId })}`,
		);

		try {
			const staffOwner = await this.staffRepository.findByUserId(userId);
			if (!staffOwner) {
				this.logger.warn(`Staff not found with user ID: ${userId}`);
				return left(new ResourceNotFoundError("Funcionário não encontrado"));
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
				companyId: staffOwner.companyId,
				role,
				createdAt: new Date(),
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

			await this.notifyPublisher.dispatch(
				new EmployeeInviteEvent(user.id.toString(), {
					email: user.email,
					name: user.name,
					expiresAt: invite.expiresAt,
					acceptInviteUrl,
				}),
			);
			return right({ invite, user });
		} catch (error) {
			this.logger.error(
				`Error inviting employee for company ${userId}`,
				(error as Error).stack,
			);
			throw error;
		}
	}
}
