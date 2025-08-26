import { Prisma } from "prisma/generated/client";
import { Decimal } from "prisma/generated/internal/prismaNamespace";
import { Service } from "src/modules/service/domain/entities/service.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PriceRange } from "@/modules/service/domain/entities/value-objects/price-range.value-object";

type PrismaService = Prisma.ServiceGetPayload<{
	include: {
		priceVariation: true;
	};
}>;

export class PrismaServiceMapper {
	static toDomain(prismaService: PrismaService): Service {
		return Service.create(
			{
				description: prismaService.description,
				priceRange: PriceRange.create({
					min: prismaService.price.toNumber(),
					max: prismaService.priceVariation.reduce(
						(acc, curr) => acc.add(curr.price),
						new Decimal(0),
					).toNumber(),
				}),
				duration: prismaService.duration,
				isActive: prismaService.isActive,
				name: prismaService.name,
				companyId: new UniqueEntityID(prismaService.companyId),
			},
			new UniqueEntityID(prismaService.id),
		);
	}

	static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
		return {
			description: service.description,
			price: service.priceRange?.min || 0,
			duration: service.duration,
			isActive: service.isActive,
			name: service.name,
			companyId: service.companyId.toString(),
			details: service.details as Prisma.JsonObject,
		};
	}

	static toPrismaUpdate(
		service: Partial<Service>,
	): Prisma.ServiceUncheckedUpdateInput {
		return {
			description: service.description,
			price: service.priceRange?.min || 0,
			duration: service.duration,
			isActive: service.isActive,
			name: service.name,
			details: service.details as Prisma.JsonObject,
		};
	}
}
