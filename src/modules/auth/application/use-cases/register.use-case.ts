import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "src/modules/user/domain/repositories/user.repository";
import { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface";
import { UserType } from "src/modules/user/domain/entities/user.entity";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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
		try {
			await this.userRepository.save({
				email: body.email,
				name: body.name,
				password: await this.passwordHasher.hashPassword(body.password),
				type: "CUSTOMER",
			});
		} catch (error) {
			if (
				error instanceof PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				const conflictField = error.meta?.target;
				throw new ConflictException(
					`Já existe um usuário com o campo: ${conflictField}`,
				);
			}
			throw error;
		}
	}
}
