import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, right } from "@/shared/either";

type CreateOrUpdateUserFromExternalRequest = {
	externalId: string;
	email: string;
	name: string;
};

type CreateOrUpdateUserFromExternalResponse = Either<Error, { id: string }>;

@Injectable()
export class CreateOrUpdateUserFromExternalUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(
		input: CreateOrUpdateUserFromExternalRequest,
	): Promise<CreateOrUpdateUserFromExternalResponse> {
		const { externalId, email, name } = input;

		const existingByExternal = await this.userRepository.findById(externalId);

		if (existingByExternal) {
			await this.userRepository.update(existingByExternal.id.toString(), {
				name: existingByExternal.name,
				email: existingByExternal.email,
				authProviderId: existingByExternal.authProviderId,
			});
			return right({ id: existingByExternal.id.toString() });
		}

		const user = User.create(
			{ name: name, email: email, authProviderId: externalId },
			new UniqueEntityID(),
		);

		await this.userRepository.create(user);
		return right({ id: user.id.toString() });
	}
}
