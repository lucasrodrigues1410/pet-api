import { PrismaClient } from "prisma/generated/client";

export async function createUser(prisma: PrismaClient) {
	await prisma.user.upsert({
		where: { id: "user-1" },
		update: {},
		create: {
			id: "user-1",
			email: "vitor@gmail.com",
			password: await Bun.password.hash("123456"),
			name: "Vitor",
			type: "CUSTOMER",
		},
	});

	await prisma.user.upsert({
		where: { id: "user-2" },
		update: {},
		create: {
			id: "user-2",
			email: "vitor-empresa@gmail.com",
			password: await Bun.password.hash("123456"),
			name: "Vitor Empresa",
			type: "COMPANY",
		},
	});
}
