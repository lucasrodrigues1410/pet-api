import { Prisma } from "prisma/generated/client";
import { Service } from "src/modules/service/domain/entities/service.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	Rules,
	RulesProps,
} from "@/modules/service/domain/entities/value-objects/rules.value-object";

type ServiceWithIncludes = Prisma.ServiceGetPayload<{
	include: { categories: { include: { category: true } } };
}>;

export class PrismaServiceMapper {
	static toDomain(prismaService: ServiceWithIncludes): Service {
		return Service.create(
			{
				description: prismaService.description,
				price: prismaService.price,
				duration: prismaService.duration ?? 0,
				isActive: prismaService.isActive,
				name: prismaService.name,
				companyId: new UniqueEntityID(prismaService.companyId),
				rulesPrompt: prismaService.rulesPrompt,
				categoryIds: prismaService.categories?.map(
					(category) => new UniqueEntityID(category.categoryId),
				),
				rules: (prismaService.rules as Array<unknown>)?.map((rule) =>
					Rules.create(rule as unknown as RulesProps),
				),
				details: prismaService.details as Record<string, unknown>,
				requiresPayment: prismaService.requiresPayment,
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
			details: (service.details ?? null) as Prisma.JsonObject,
			rulesPrompt: service.rulesPrompt,
			rules: service.rules?.map((rule) => rule.toObject()),
			requiresPayment: service.requiresPayment,
		};
	}

	static toPrismaUpdate(
		service: Partial<Service>,
	): Prisma.ServiceUncheckedUpdateInput {
		return {
			description: service.description,
			price: service.price,
			duration: service.duration,
			isActive: service.isActive,
			name: service.name,
			details: service.details as Prisma.JsonObject,
			rulesPrompt: service.rulesPrompt,
			rules: service.rules?.map((rule) => rule.toObject()),
			requiresPayment: service.requiresPayment,
		};
	}
}
