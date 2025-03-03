import { Injectable } from "@nestjs/common";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";
import { Either, left, right } from "src/common/either";
import { ResourceNotFoundError } from "src/common/errors/errors/resource-not-found.error";

interface FindUserByIdUseCaseRequest {
	userId: number;
}

type FindUserByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		user: User;
	}
>;

@Injectable()
export class FindUserByIdUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute({
		userId,
	}: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
		const user = await this.userRepository.findById(userId);
		console.log(user)
		if (!user) {
			return left(new ResourceNotFoundError());
		}

		return right({
			user,
		});
	}
}
