import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Staff, StaffRole } from "../../domain/entities/staff.entity";
import { StaffRepository } from "../../domain/repositories/staff.repository";

type CreateStaffUseCaseInput = {
	email: string;
	name: string;
	role: StaffRole;
	companyId: string;
	loggedUserId: string;
};

@Injectable()
export class CreateStaffUseCase {
	constructor(
		private readonly staffRepository: StaffRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(staffData: CreateStaffUseCaseInput) {
		const loggedUserStaff = await this.staffRepository.findByUserId(
			staffData.loggedUserId,
		);
		if (loggedUserStaff?.companyId.equals(staffData.companyId)) {
			return left(
				new NotAllowedError("Only staff members can create new staff"),
			);
		}

		const existingStaff = await this.staffRepository.findByUserEmail(
			staffData.email,
		);
		if (existingStaff) {
			return left(
				new ResourceNotFoundError("Staff with this email already exists"),
			);
		}

		let staffUserId: UniqueEntityID;
		const existingUser = await this.userRepository.findByEmail(staffData.email);

		if (existingUser) {
			staffUserId = existingUser.id;
		} else {
			const newUser = User.create({
				email: staffData.email,
				name: staffData.name,
			});
			await this.userRepository.create(newUser);
			staffUserId = newUser.id;
		}

		const newStaff = Staff.create({
			userId: staffUserId,
			companyId: new UniqueEntityID(staffData.companyId),
			role: staffData.role,
		});

		await this.staffRepository.create(newStaff);
		return right(undefined);
	}
}
