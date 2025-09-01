import { PrismaClient } from "prisma/generated/client";

const customerUsers = [
	{
		id: "user-1",
		email: "maria.silva@gmail.com",
		name: "Maria Silva",
		type: "customer" as const,
	},
	{
		id: "user-2", 
		email: "joao.santos@outlook.com",
		name: "João Santos",
		type: "customer" as const,
	},
	{
		id: "user-3",
		email: "ana.costa@yahoo.com", 
		name: "Ana Costa",
		type: "customer" as const,
	},
	{
		id: "user-4",
		email: "carlos.oliveira@gmail.com",
		name: "Carlos Oliveira", 
		type: "customer" as const,
	},
	{
		id: "user-5",
		email: "fernanda.lima@hotmail.com",
		name: "Fernanda Lima",
		type: "customer" as const,
	},
	{
		id: "user-6",
		email: "ricardo.pereira@gmail.com",
		name: "Ricardo Pereira",
		type: "customer" as const,
	},
	{
		id: "user-7",
		email: "patricia.alves@gmail.com", 
		name: "Patrícia Alves",
		type: "customer" as const,
	},
	{
		id: "user-8",
		email: "bruno.ferreira@outlook.com",
		name: "Bruno Ferreira",
		type: "customer" as const,
	},
];

const companyUsers = [
	{
		id: "company-user-1",
		email: "admin@petshopbellacane.com.br",
		name: "Roberto Mendes",
		type: "company" as const,
	},
	{
		id: "company-user-2", 
		email: "contato@mundopet.com.br",
		name: "Luciana Rodrigues",
		type: "company" as const,
	},
	{
		id: "company-user-3",
		email: "gerente@patasecia.com.br",
		name: "Diego Almeida",
		type: "company" as const,
	},
	{
		id: "company-user-4",
		email: "admin@caopanheiro.com.br",
		name: "Camila Souza",
		type: "company" as const,
	},
];

const adminUsers = [
	{
		id: "admin-1",
		email: "admin@petapi.com",
		name: "Administrador Sistema",
		type: "admin" as const,
	},
];

export async function createUser(prisma: PrismaClient) {
	const defaultPassword = await Bun.password.hash("123456");

	// Criar usuários clientes
	for (const user of customerUsers) {
		await prisma.user.upsert({
			where: { id: user.id },
			update: {},
			create: {
				...user,
				password: defaultPassword,
			},
		});
	}

	// Criar usuários de empresas
	for (const user of companyUsers) {
		await prisma.user.upsert({
			where: { id: user.id },
			update: {},
			create: {
				...user,
				password: defaultPassword,
			},
		});
	}

	// Criar usuários administradores
	for (const user of adminUsers) {
		await prisma.user.upsert({
			where: { id: user.id },
			update: {},
			create: {
				...user,
				password: defaultPassword,
			},
		});
	}
}
