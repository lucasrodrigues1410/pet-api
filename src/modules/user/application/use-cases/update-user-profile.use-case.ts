import { Either, left, right } from "@/shared/either";
import { UserRepository } from "../../domain/repositories/user.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";

type UpdateUserProfileInput = {
	userId: string;
	profileData: Partial<{
		email: string;
		name: string;
	}>;
};

type UpdateUserProfileOutput = Either<ResourceNotFoundError, void>;

@Injectable()
export class UpdateUserProfileUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(
		params: UpdateUserProfileInput,
	): Promise<UpdateUserProfileOutput> {
		const user = await this.userRepository.findById(params.userId);
		if (!user || user.id.toString() !== params.userId) {
			return left(new ResourceNotFoundError("Usuário não encontrado"));
		}

		user.update(params.profileData);
		
		await this.userRepository.update(user);
		return right(undefined);
	}
}
