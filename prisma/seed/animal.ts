import { PrismaClient } from "@/prisma-generated/client";

export async function createAnimal(prisma: PrismaClient) {
	await prisma.animal.upsert({
		where: { id: "animal-1" },
		update: {},
		create: {
			id: "animal-1",
			name: "Rex",
			weight: 10,
			birthdate: new Date("2020-01-01"),
			breedId: "breed-1",
			userId: "user-1",
		},
	});
}
