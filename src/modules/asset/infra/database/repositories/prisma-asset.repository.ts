import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Asset } from "src/modules/asset/domain/entities/asset";
import { AssetRepository } from "src/modules/asset/domain/repositories/asset.repository";
import { PrismaAssetMapper } from "../mappers/prisma-asset.mapper";

@Injectable()
export class PrismaAssetRepository implements AssetRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async create(asset: Asset): Promise<void> {
		await this.prismaService.asset.create({
			data: PrismaAssetMapper.toPrisma(asset),
		});
	}
}
