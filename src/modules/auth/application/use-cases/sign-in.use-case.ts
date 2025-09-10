import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { User, UserType } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import { Encrypter } from "../../domain/interfaces/encrypter.interface";
import { HashComparer } from "../../domain/interfaces/hash-comparer.interface";

interface SignInUseCaseRequest {
	email: string;
	password: string;
	type: UserType;
}

type SignInUseCaseResponse = Either<
	InvalidCredentialsError,
	User & { accessToken: string; staffRole?: StaffRole; companyId?: string }
>;

@Injectable()
export class SignInUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly staffRepository: StaffRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
		type,
	}: SignInUseCaseRequest): Promise<SignInUseCaseResponse> {
		const user = await this.userRepository.findByEmail(email);
		const isPasswordValid = await this.hashComparer.compare(
			password,
			user?.password ?? "",
		);

		if (!user || !isPasswordValid || user.type !== type) {
			return left(new InvalidCredentialsError());
		}

		let staffRole: StaffRole | undefined;
		let companyId: string | undefined;

		if (user.type === "company") {
			const staff = await this.staffRepository.findByUserId(user.id.toString());
			if (!staff) return left(new InvalidCredentialsError());

			staffRole = staff.role;
			companyId = staff.companyId.toString();
		}

		const accessToken = await this.encrypter.encrypt({
			sub: user.id.toString(),
			name: user.name,
			email: user.email,
			type: user.type,
			role: staffRole,
			companyId: companyId,
			avatar: user.avatar?.url,
		});

		return right(Object.assign(user, { accessToken, staffRole, companyId }));
	}
}
