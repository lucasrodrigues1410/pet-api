import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Staff, StaffRole } from "../../domain/entities/staff.entity";
import { StaffRepository } from "../../domain/repositories/staff.repository";

type CreateStaffUseCaseInput = {
	email: string;
	name: string;
	role: StaffRole;
	companyId: string;
};

type CreateStaffUseCaseResponse = Either<
	NotAllowedError | ResourceNotFoundError,
	{ userId: string }
>;

@Injectable()
export class CreateStaffUseCase {
	constructor(
		private readonly staffRepository: StaffRepository,
		private readonly userRepository: UserRepository,
	) {}

	async execute(
		staffData: CreateStaffUseCaseInput,
	): Promise<CreateStaffUseCaseResponse> {
		const user = await this.userRepository.findByEmail(staffData.email);
		if (!user) {
			return left(
				new ResourceNotFoundError("Does not exist user with this email"),
			);
		}

		const newStaff = Staff.create({
			userId: user.id,
			companyId: new UniqueEntityID(staffData.companyId),
			role: staffData.role,
		});

		await this.staffRepository.create(newStaff);
		return right({ userId: user.id.toString() });
	}
}
