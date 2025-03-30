import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { PriceVariationRepository } from "@/modules/price-variation/domain/repositories/price-variation.repository";
import { PrismaPriceVariationMapper } from "../mappers/prisma-price-variation.mapper";

export class PrismaPriceVariationRepository
	implements PriceVariationRepository
{
	constructor(private prismaService: PrismaService) {}

	async getAllByServiceId(serviceId: string) {
		const result = await this.prismaService.servicePriceVariation.findMany({
			where: {
				serviceId,
			},
		});

		return result.map((item) => PrismaPriceVariationMapper.toDomain(item));
	}
}
