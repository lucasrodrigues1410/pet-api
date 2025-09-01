import { PrismaClient } from "prisma/generated/client";

const animals = [
	// Animais do usuário Maria Silva (user-1)
	{
		id: "animal-1",
		name: "Bella",
		weight: 28.5,
		birthdate: new Date("2020-03-15"),
		breedId: "breed-1", // Labrador
		userId: "user-1",
		assetId: "asset-labrador",
	},
	{
		id: "animal-2", 
		name: "Mimi",
		weight: 4.2,
		birthdate: new Date("2021-07-22"),
		breedId: "breed-17", // Persa
		userId: "user-1",
		assetId: "asset-persa",
	},

	// Animais do usuário João Santos (user-2)
	{
		id: "animal-3",
		name: "Thor",
		weight: 35.0,
		birthdate: new Date("2019-11-10"),
		breedId: "breed-3", // Pastor Alemão
		userId: "user-2",
		assetId: "asset-pastor-alemao",
	},

	// Animais do usuário Ana Costa (user-3)
	{
		id: "animal-4",
		name: "Luna",
		weight: 12.8,
		birthdate: new Date("2022-01-05"),
		breedId: "breed-4", // Bulldog Francês
		userId: "user-3",
		assetId: "asset-bulldog-frances",
	},
	{
		id: "animal-5",
		name: "Simba",
		weight: 5.1,
		birthdate: new Date("2021-09-12"),
		breedId: "breed-18", // Siamês
		userId: "user-3",
		assetId: "asset-siames",
	},

	// Animais do usuário Carlos Oliveira (user-4)
	{
		id: "animal-6",
		name: "Max",
		weight: 25.3,
		birthdate: new Date("2020-06-18"),
		breedId: "breed-2", // Golden Retriever
		userId: "user-4",
		assetId: "asset-golden",
	},
	{
		id: "animal-7",
		name: "Chocolate",
		weight: 8.5,
		birthdate: new Date("2021-12-03"),
		breedId: "breed-5", // Poodle
		userId: "user-4",
		assetId: "asset-poodle",
	},

	// Animais do usuário Fernanda Lima (user-5)
	{
		id: "animal-8",
		name: "Nina",
		weight: 2.8,
		birthdate: new Date("2022-04-20"),
		breedId: "breed-7", // Yorkshire Terrier
		userId: "user-5",
		assetId: "asset-yorkshire",
	},
	{
		id: "animal-9",
		name: "Pipoca",
		weight: 0.15,
		birthdate: new Date("2022-08-15"),
		breedId: "breed-31", // Hamster Sírio
		userId: "user-5",
		assetId: "asset-hamster",
	},

	// Animais do usuário Ricardo Pereira (user-6)
	{
		id: "animal-10",
		name: "Buddy",
		weight: 18.7,
		birthdate: new Date("2019-12-25"),
		breedId: "breed-8", // Beagle
		userId: "user-6",
		assetId: "asset-beagle",
	},
	{
		id: "animal-11",
		name: "Mel",
		weight: 6.2,
		assetId: "asset-shih-tzu",
		birthdate: new Date("2021-05-14"),
		breedId: "breed-9", // Shih Tzu
		userId: "user-6",
	},

	// Animais do usuário Patrícia Alves (user-7)
	{
		id: "animal-12",
		name: "Zeus",
		weight: 22.1,
		birthdate: new Date("2020-10-08"),
		breedId: "breed-10", // Border Collie
		userId: "user-7",
		assetId: "asset-border-collie",
	},
	{
		id: "animal-13",
		name: "Princesa",
		weight: 3.8,
		birthdate: new Date("2022-02-28"),
		breedId: "breed-19", // Maine Coon
		userId: "user-7",
		assetId: "asset-maine-coon",
	},
	{
		id: "animal-14",
		name: "Piu-Piu",
		weight: 0.08,
		birthdate: new Date("2021-11-30"),
		breedId: "breed-34", // Canário
		userId: "user-7",
		assetId: "asset-canario",
	},

	// Animais do usuário Bruno Ferreira (user-8)
	{
		id: "animal-15",
		name: "Hades",
		weight: 32.5,
		birthdate: new Date("2019-08-17"),
		breedId: "breed-11", // Husky Siberiano
		userId: "user-8",
		assetId: "asset-husky",
	},
	{
		id: "animal-16",
		name: "Pequeno",
		weight: 1.9,
		birthdate: new Date("2022-06-10"),
		breedId: "breed-12", // Chihuahua
		userId: "user-8",
		assetId: "asset-chihuahua",
	},
	{
		id: "animal-17",
		name: "Branquinha",
		weight: 1.2,
		birthdate: new Date("2021-03-08"),
		breedId: "breed-27", // Coelho Angorá
		userId: "user-8",
		assetId: "asset-coelho",
	},

	// Mais alguns animais variados
	{
		id: "animal-18",
		name: "Caramelo",
		weight: 15.5,
		birthdate: new Date("2020-07-12"),
		breedId: "breed-16", // Vira-lata (cão)
		userId: "user-1",
		assetId: "asset-vira-lata-cao",
	},
	{
		id: "animal-19",
		name: "Pretinha",
		weight: 3.5,
		birthdate: new Date("2021-10-25"),
		breedId: "breed-26", // Vira-lata (gato)
		userId: "user-2",
		assetId: "asset-vira-lata-gato",
	},
	{
		id: "animal-20",
		name: "Salsicha",
		weight: 7.8,
		birthdate: new Date("2020-12-14"),
		breedId: "breed-13", // Dachshund
		userId: "user-3",
		assetId: "asset-dachshund",
	},
];

export async function createAnimal(prisma: PrismaClient) {
	for (const animal of animals) {
		await prisma.animal.upsert({
			where: { id: animal.id },
			update: {},
			create: animal,
		});
	}
}
