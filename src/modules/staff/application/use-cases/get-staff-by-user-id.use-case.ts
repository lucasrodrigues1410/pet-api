import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Staff } from "../../domain/entities/staff.entity";
import { StaffRepository } from "../../domain/repositories/staff.repository";

type GetStaffByUserIdResponse = Either<ResourceNotFoundError, Staff>;

@Injectable()
export class GetStaffByUserIdUseCase {
	constructor(private readonly staffRepository: StaffRepository) {}

	async execute(userId: string): Promise<GetStaffByUserIdResponse> {
		const response = await this.staffRepository.findByUserId(userId);

		if (!response) {
			return left(
				new ResourceNotFoundError(
					"Staff member not found for the given user ID",
				),
			);
		}

		return right(response);
	}
}
