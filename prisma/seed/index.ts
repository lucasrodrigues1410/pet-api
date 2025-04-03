import { PrismaClient } from "@prisma/client";
import { createAnimal } from "./animal";
import { createAnimalType } from "./animal-type";
import { createBreed } from "./breed";
import { createCompany } from "./company";
import { createService } from "./service";
import { createUser } from "./user";

const prisma = new PrismaClient();

async function main() {
	await createUser(prisma);
	await createAnimalType(prisma);
	await createBreed(prisma);
	await createAnimal(prisma);
	await createCompany(prisma);
	await createService(prisma);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
