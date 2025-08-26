import {
	Prisma,
	Asset as PrismaAsset,
	CompanyImage as PrismaCompanyImage,
} from "prisma/generated/client";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";
import { CompanyImage } from "@/modules/company/domain/entities/company_image.entity";

export class PrismaCompanyImageMapper {
	static toDomain(
		prismaCompanyImage: PrismaCompanyImage & { asset: PrismaAsset },
	): CompanyImage {
		return CompanyImage.create(
			{
				asset: PrismaAssetMapper.toDomain(prismaCompanyImage.asset),
				companyId: prismaCompanyImage.companyId,
			},
			new UniqueEntityID(prismaCompanyImage.assetId),
		);
	}

	static toPrisma(
		companyImage: CompanyImage,
	): Prisma.CompanyImageUncheckedCreateInput {
		return {
			assetId: companyImage.asset.id.toString(),
			companyId: companyImage.companyId,
		};
	}
}
