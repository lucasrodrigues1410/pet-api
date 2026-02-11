import { Injectable } from "@nestjs/common";
import { Prisma } from "prisma/generated/client";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import { Disease } from "src/modules/disease/domain/entities/disease.entity";
import { DiseaseRepository } from "src/modules/disease/domain/repositories/disease.repository";
import { PrismaDiseaseMapper } from "../mappers/prisma-disease.mapper";

@Injectable()
export class PrismaDiseaseRepository implements DiseaseRepository {
	constructor(private prismaService: PrismaService) {}

	async getAll(params: Parameters<DiseaseRepository["getAll"]>[0]) {
		const options = {
			name: { contains: params.query ?? "", mode: "insensitive" },
		} as Prisma.DiseaseWhereInput;

		const response = await this.prismaService.disease.findMany({
			where: options,
		});
		return response.map(PrismaDiseaseMapper.toDomain);
	}

	async findById(id: string) {
		const disease = await this.prismaService.disease.findUnique({ where: { id } });

		if (!disease) {
			return null;
		}

		return PrismaDiseaseMapper.toDomain(disease);
	}

	async create(disease: Disease): Promise<void> {
		await this.prismaService.disease.create({
			data: PrismaDiseaseMapper.toPrisma(disease),
		});
	}
}
