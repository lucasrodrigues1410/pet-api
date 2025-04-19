import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PriceRange } from "@/modules/service/domain/entities/value-objects/price-range.value-object";
import { Prisma, Service as PrismaService } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { Service } from "src/modules/service/domain/entities/service.entity";

export class PrismaServiceMapper {
	static toDomain(
		prismaService: PrismaService & {
			maxPrice?: number | Decimal | null;
		},
	): Service {
		return Service.create(
			{
				description: prismaService.description,
				price: prismaService.price.toNumber(),
				duration: prismaService.duration,
				isActive: prismaService.isActive,
				name: prismaService.name,
				companyId: new UniqueEntityID(prismaService.companyId),
				priceRange: PriceRange.create(
					prismaService.maxPrice
						? {
								min: Number(prismaService.price),
								max: Number(prismaService.maxPrice),
							}
						: undefined,
				),
			},
			new UniqueEntityID(prismaService.id),
		);
	}

	static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
		return {
			description: service.description,
			price: service.price,
			duration: service.duration,
			isActive: service.isActive,
			name: service.name,
			companyId: service.companyId.toString(),
			details: service.details as Prisma.JsonObject,
		};
	}
}
