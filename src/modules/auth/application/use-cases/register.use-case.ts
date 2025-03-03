import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "src/modules/user/domain/repositories/user.repository";
import { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface";
import { UserType } from "src/modules/user/domain/entities/user.entity";

interface UserRegistration {
	email: string;
	name: string;
	password: string;
}

@Injectable()
export class RegisterUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		@Inject("IPasswordHasher")
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(body: UserRegistration) {
		await this.userRepository.save({
			email: body.email,
			name: body.name,
			password: await this.passwordHasher.hashPassword(body.password),
			type: UserType.CUSTOMER,
		});
	}
}
