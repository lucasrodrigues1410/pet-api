import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import type { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import { Encrypter } from "../../domain/interfaces/encrypter.interface";
import { HashComparer } from "../../domain/interfaces/hash-comparer.interface";

interface SignInCompanyUseCaseRequest {
	email: string;
	password: string;
}

export type SignInCompanyUseCaseResponse = Either<
	InvalidCredentialsError,
	User & {
		accessToken: string;
		staffRole: StaffRole;
		companyId: string;
	}
>;

@Injectable()
export class SignInCompanyUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly staffRepository: StaffRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: SignInCompanyUseCaseRequest): Promise<SignInCompanyUseCaseResponse> {
		const user = await this.userRepository.findByEmail(email);

		var staffRole: StaffRole | undefined;
		var companyId: string | undefined;
		const isPasswordValid = await this.hashComparer.compare(
			password,
			user?.password ?? "",
		);

		if (!user || !isPasswordValid) return left(new InvalidCredentialsError());
		const staff = await this.staffRepository.findByUserId(user.id.toString());
		if (!staff) return left(new InvalidCredentialsError());

		staffRole = staff?.role;
		companyId = staff?.companyId.toString();

		const accessToken = await this.encrypter.encrypt({
			sub: user.id.toString(),
			name: user.name,
			email: user.email,
			type: user.type,
			role: staffRole,
			companyId: companyId,
			avatar: user.avatar?.url,
		});

		return right(
			Object.assign(user, {
				accessToken,
				staffRole,
				companyId,
			}),
		);
	}
}
