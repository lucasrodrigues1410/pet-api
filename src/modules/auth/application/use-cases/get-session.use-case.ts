import { Injectable } from "@nestjs/common";
import { UserType } from "@/modules/user/domain/entities/user.entity";
import { Either, right } from "@/shared/either";

interface GetSessionUseCaseRequest {
	sub: string;
	name: string;
	email: string;
	type: UserType;
	companyId?: string | undefined;
	role?: string | undefined;
}

type GetSessionUseCaseResponse = Either<
	never,
	{
		sub: string;
		name: string;
		email: string;
		type: UserType;
		companyId?: string | undefined;
		role?: string | undefined;
	}
>;

@Injectable()
export class GetSessionUseCase {
	async execute(
		request: GetSessionUseCaseRequest,
	): Promise<GetSessionUseCaseResponse> {
		return right(request);
	}
}
