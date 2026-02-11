import { PrismaClient } from "prisma/generated/client";

const diseases = [
	{
		id: "disease-1",
		name: "Raiva",
	},
	{
		id: "disease-2",
		name: "Parvovirose",
	},
	{
		id: "disease-3",
		name: "Cinomose",
	},
	{
		id: "disease-4",
		name: "Dermatite",
	},
	{
		id: "disease-5",
		name: "Otite",
	},
	{
		id: "disease-6",
		name: "Gengivite",
	},
	{
		id: "disease-7",
		name: "Gastroenterite",
	},
	{
		id: "disease-8",
		name: "Alergia",
	},
	{
		id: "disease-9",
		name: "Pulga",
	},
	{
		id: "disease-10",
		name: "Carrapato",
	},
	{
		id: "disease-11",
		name: "Verme",
	},
	{
		id: "disease-12",
		name: "Conjuntivite",
	},
	{
		id: "disease-13",
		name: "Cataratas",
	},
	{
		id: "disease-14",
		name: "Artrite",
	},
	{
		id: "disease-15",
		name: "Diabetes",
	},
];

export async function createDisease(prisma: PrismaClient) {
	for (const disease of diseases) {
		await prisma.disease.upsert({
			where: { id: disease.id },
			update: {},
			create: disease,
		});
	}
	console.log(`✓ ${diseases.length} doenças criadas/verificadas`);
}
