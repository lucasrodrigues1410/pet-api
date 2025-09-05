import { Injectable, Logger } from "@nestjs/common";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { CompanyRepository } from "../../domain/repositories/company.repository";

interface AddLogoToCompanyRequest {
	companyId: string;
	userId: string;
	file: Express.Multer.File;
}

type AddLogoToCompanyResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class AddLogoToCompanyUseCase {
	private readonly logger = new Logger(AddLogoToCompanyUseCase.name);

	constructor(
		private readonly companyRepository: CompanyRepository,
		private readonly uploadAndCreateAsset: UploadAndCreateAssetUseCase,
	) {}

	async execute(
		data: AddLogoToCompanyRequest,
	): Promise<AddLogoToCompanyResponse> {
		this.logger.log(
			`Executing add logo to company use case. CompanyId: ${data.companyId}, UserId: ${data.userId}`,
		);
		this.logger.debug(
			`File info: ${data.file.originalname}, Size: ${data.file.size} bytes, MimeType: ${data.file.mimetype}`,
		);

		try {
			const company = await this.companyRepository.findById(data.companyId);

			if (!company) {
				this.logger.warn(
					`Company not found for logo addition. CompanyId: ${data.companyId}`,
				);
				return left(new ResourceNotFoundError());
			}

			this.logger.debug(`Company found. Proceeding with logo addition`);

			const result = await this.uploadAndCreateAsset.execute({
				file: data.file,
				userId: data.userId,
				fileName: `companies/company-${data.companyId}-logo`,
			});

			if (result.isLeft()) {
				this.logger.error(
					`Failed to create asset for company ${data.companyId}. Error: ${result.value.message}`,
				);
				return left(result.value);
			}

			this.logger.debug(
				`Asset created successfully. AssetId: ${result.value.asset.id.toString()}`,
			);

			await this.companyRepository.update(data.companyId, {
				logoAssetId: result.value.asset.id,
			});

			this.logger.log(
				`Logo ${result.value.asset.id.toString()} added successfully to company ${data.companyId}`,
			);

			return right(undefined);
		} catch (error) {
			this.logger.error(
				`Error adding logo to company ${data.companyId} for user ${data.userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
