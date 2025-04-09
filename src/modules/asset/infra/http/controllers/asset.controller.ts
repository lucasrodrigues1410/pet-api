import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import {
	BadRequestException,
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InvalidAssetTypeError } from "src/modules/asset/application/errors/invalid-asset-type.error";
import { UploadAndCreateAssetUseCase } from "src/modules/asset/application/use-cases/upload-and-create-asset.use-case";

ApiTags("Asset");
@Controller("asset")
export class AssetController {
	constructor(
		private readonly uploadAndCreateAsset: UploadAndCreateAssetUseCase,
	) {}

	@ApiOperation({ summary: "Envia um arquivo e cria um asset" })
	@Post()
	@ApiConsumes("multipart/form-data")
	@UseInterceptors(FileInterceptor("file"))
	async handle(
		@User("sub") userId: string,
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 1024 * 1024 * 2,
					}),
					new FileTypeValidator({
						fileType: ".(png|jpg|jpeg|pdf)",
					}),
				],
			}),
		)
		file: Express.Multer.File,
	) {
		const result = await this.uploadAndCreateAsset.execute({
			fileName: file.originalname,
			fileType: file.mimetype,
			body: file.buffer,
			userId,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case InvalidAssetTypeError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { asset } = result.value;

		return {
			attachmentId: asset.id.toString(),
		};
	}
}
