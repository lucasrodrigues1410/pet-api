import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";

interface GetSessionUseCaseRequest {
	sub: string;
    name: string;
    email: string;
    type: string;
    companyId?: string | undefined;
    role?: string | undefined;
}

type GetSessionUseCaseResponse = Either<
	never,
	{
		sub: string;
		name: string;
		email: string;
		type: string;
		companyId?: string | undefined;
		role?: string | undefined;
	}
>;

@Injectable()
export class GetSessionUseCase {
	async execute(request: GetSessionUseCaseRequest): Promise<GetSessionUseCaseResponse> {
		return right(request);
	}
}
