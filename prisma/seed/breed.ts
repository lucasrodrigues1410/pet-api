import { PrismaClient } from "@/prisma-generated/client";

export async function createBreed(prisma: PrismaClient) {
	return prisma.breed.upsert({
		where: { id: "breed-1" },
		update: {},
		create: {
			id: "breed-1",
			name: "Labrador",
			animalTypeId: "animal-type-1",
		},
	});
}
