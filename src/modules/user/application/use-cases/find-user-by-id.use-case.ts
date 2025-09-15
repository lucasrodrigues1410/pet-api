import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../domain/repositories/user.repository";

interface FindUserByIdUseCaseRequest {
	userId: string;
}

type FindUserByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{ user: User }
>;

@Injectable()
export class FindUserByIdUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute({
		userId,
	}: FindUserByIdUseCaseRequest): Promise<FindUserByIdUseCaseResponse> {
		const user = await this.userRepository.findById(userId);
		if (!user) {
			return left(new ResourceNotFoundError());
		}

		return right({ user });
	}
}
