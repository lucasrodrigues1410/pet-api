import { PrismaClient } from "@prisma/client";

export async function createService(prisma: PrismaClient) {
	await prisma.category.upsert({
		where: { id: "category-1" },
		update: {},
		create: {
			id: "category-1",
			name: "Grooming",
			type: "PETSHOP",
		},
	});

	await prisma.service.upsert({
		where: { id: "service-1" },
		update: {},
		create: {
			id: "service-1",
			name: "Grooming",
			description: "Grooming service for pets",
			price: 50,
			duration: 60,
			companyId: "company-1",
			isActive: true,
			details: {},
		},
	});

	await prisma.serviceCategory.upsert({
		where: {
			serviceId_categoryId: {
				serviceId: "service-1",
				categoryId: "category-1",
			},
		},
		update: {},
		create: {
			serviceId: "service-1",
			categoryId: "category-1",
			assignedAt: new Date(),
		},
	});

	await prisma.servicePriceVariation.upsert({
		where: { id: "service-price-variation-1" },
		update: {},
		create: {
			id: "service-price-variation-1",
			price: 50,
			value: "SMALL",
			variation: "SIZE",
			serviceId: "service-1",
		},
	});
}
