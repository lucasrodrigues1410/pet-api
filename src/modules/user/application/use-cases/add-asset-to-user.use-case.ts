import { Injectable } from "@nestjs/common";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { UserRepository } from "../../domain/repositories/user.repository";

interface AddAssetToUserRequest {
	userId: string;
	file: Express.Multer.File;
}

type AddAssetToUserResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class AddAssetToUserUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly uploadAndCreateAsset: UploadAndCreateAssetUseCase,
	) {}

	async execute({
		userId,
		file,
	}: AddAssetToUserRequest): Promise<AddAssetToUserResponse> {
		const user = await this.userRepository.findById(userId);
		if (!user || user.id.toString() !== userId) {
			return left(new ResourceNotFoundError("Usuário não encontrado"));
		}

		const result = await this.uploadAndCreateAsset.execute({
			file,
			userId,
			fileName: `users/user-${userId}`,
		});

		if (result.isLeft()) {
			return left(result.value);
		}

		await this.userRepository.update(user.id.toString(), {
			avatarAssetId: result.value.asset.id.toString(),
		});

		return right(undefined);
	}
}
