import { PrismaClient } from "prisma/generated/client";

const animalTypes = [
	{
		id: "animal-type-1",
		name: "Cão",
	},
	{
		id: "animal-type-2", 
		name: "Gato",
	},
	{
		id: "animal-type-3",
		name: "Coelho",
	},
	{
		id: "animal-type-4",
		name: "Hamster",
	},
	{
		id: "animal-type-5",
		name: "Pássaro",
	},
];

export async function createAnimalType(prisma: PrismaClient) {
	for (const animalType of animalTypes) {
		await prisma.animalType.upsert({
			where: { id: animalType.id },
			update: {},
			create: animalType,
		});
	}
}
