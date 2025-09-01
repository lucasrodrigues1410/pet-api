import { PrismaClient } from "prisma/generated/client";

const breeds = [
	// Raças de Cães
	{ id: "breed-1", name: "Labrador", animalTypeId: "animal-type-1" },
	{ id: "breed-2", name: "Golden Retriever", animalTypeId: "animal-type-1" },
	{ id: "breed-3", name: "Pastor Alemão", animalTypeId: "animal-type-1" },
	{ id: "breed-4", name: "Bulldog Francês", animalTypeId: "animal-type-1" },
	{ id: "breed-5", name: "Poodle", animalTypeId: "animal-type-1" },
	{ id: "breed-6", name: "Rottweiler", animalTypeId: "animal-type-1" },
	{ id: "breed-7", name: "Yorkshire Terrier", animalTypeId: "animal-type-1" },
	{ id: "breed-8", name: "Beagle", animalTypeId: "animal-type-1" },
	{ id: "breed-9", name: "Shih Tzu", animalTypeId: "animal-type-1" },
	{ id: "breed-10", name: "Border Collie", animalTypeId: "animal-type-1" },
	{ id: "breed-11", name: "Husky Siberiano", animalTypeId: "animal-type-1" },
	{ id: "breed-12", name: "Chihuahua", animalTypeId: "animal-type-1" },
	{ id: "breed-13", name: "Dachshund", animalTypeId: "animal-type-1" },
	{ id: "breed-14", name: "Boxer", animalTypeId: "animal-type-1" },
	{ id: "breed-15", name: "Cocker Spaniel", animalTypeId: "animal-type-1" },
	{ id: "breed-16", name: "Vira-lata", animalTypeId: "animal-type-1" },

	// Raças de Gatos
	{ id: "breed-17", name: "Persa", animalTypeId: "animal-type-2" },
	{ id: "breed-18", name: "Siamês", animalTypeId: "animal-type-2" },
	{ id: "breed-19", name: "Maine Coon", animalTypeId: "animal-type-2" },
	{ id: "breed-20", name: "British Shorthair", animalTypeId: "animal-type-2" },
	{ id: "breed-21", name: "Ragdoll", animalTypeId: "animal-type-2" },
	{ id: "breed-22", name: "Bengal", animalTypeId: "animal-type-2" },
	{ id: "breed-23", name: "Russian Blue", animalTypeId: "animal-type-2" },
	{ id: "breed-24", name: "Sphynx", animalTypeId: "animal-type-2" },
	{ id: "breed-25", name: "Scottish Fold", animalTypeId: "animal-type-2" },
	{ id: "breed-26", name: "Vira-lata", animalTypeId: "animal-type-2" },

	// Raças de Coelhos
	{ id: "breed-27", name: "Angorá", animalTypeId: "animal-type-3" },
	{ id: "breed-28", name: "Mini Lop", animalTypeId: "animal-type-3" },
	{ id: "breed-29", name: "Holland Lop", animalTypeId: "animal-type-3" },
	{ id: "breed-30", name: "Rex", animalTypeId: "animal-type-3" },

	// Raças de Hamsters
	{ id: "breed-31", name: "Sírio", animalTypeId: "animal-type-4" },
	{ id: "breed-32", name: "Anão Russo", animalTypeId: "animal-type-4" },
	{ id: "breed-33", name: "Chinês", animalTypeId: "animal-type-4" },

	// Raças de Pássaros
	{ id: "breed-34", name: "Canário", animalTypeId: "animal-type-5" },
	{ id: "breed-35", name: "Periquito", animalTypeId: "animal-type-5" },
	{ id: "breed-36", name: "Calopsita", animalTypeId: "animal-type-5" },
	{ id: "breed-37", name: "Agapornis", animalTypeId: "animal-type-5" },
];

export async function createBreed(prisma: PrismaClient) {
	for (const breed of breeds) {
		await prisma.breed.upsert({
			where: { id: breed.id },
			update: {},
			create: breed,
		});
	}
}
