import { PrismaClient } from "@/prisma-generated/client";

export async function createAnimalType(prisma: PrismaClient) {
	await prisma.animalType.upsert({
		where: { id: "animal-type-1" },
		update: {},
		create: {
			id: "animal-type-1",
			name: "Dog",
		},
	});
}
