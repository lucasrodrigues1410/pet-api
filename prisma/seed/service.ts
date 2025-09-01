import { PrismaClient } from "prisma/generated/client";

const categories = [
	{
		id: "category-1",
		name: "Banho",
		description: "Serviços de banho completo e limpeza",
		type: "petshop" as const,
	},
	{
		id: "category-2", 
		name: "Tosa",
		description: "Serviços de tosa artística e estética",
		type: "petshop" as const,
	},
	{
		id: "category-3",
		name: "Tosa Higiênica",
		description: "Cortes higiênicos e aparação de pelos",
		type: "petshop" as const,
	},
	{
		id: "category-4",
		name: "Banho + Tosa",
		description: "Pacotes completos de higiene e estética",
		type: "petshop" as const,
	},
	{
		id: "category-5",
		name: "Higiene Especializada",
		description: "Serviços premium e tratamentos especiais",
		type: "petshop" as const,
	},
];

const services = [
	// Serviços da Pet Shop Bella Cane (company-1)
	{
		id: "service-1",
		name: "Banho Completo",
		description: "Banho com shampoo específico para o tipo de pelo, secagem e perfume",
		price: 35.00,
		duration: 60,
		companyId: "company-1",
		capacity: 3,
		details: {
			includes: ["Shampoo específico", "Condicionador", "Secagem", "Perfume", "Limpeza de ouvidos"],
			restrictions: ["Animais agressivos necessitam contenção"],
		},
		categories: ["category-1"],
	},
	{
		id: "service-2",
		name: "Tosa Higiênica",
		description: "Corte de pelos em regiões íntimas e patas para maior higiene",
		price: 25.00,
		duration: 30,
		companyId: "company-1", 
		capacity: 4,
		details: {
			includes: ["Corte higiênico", "Limpeza de patas", "Aparação de unhas"],
		},
		categories: ["category-3"],
	},
	{
		id: "service-3",
		name: "Tosa Artística",
		description: "Tosa personalizada conforme preferência do cliente",
		price: 55.00,
		duration: 90,
		companyId: "company-1",
		capacity: 2,
		details: {
			includes: ["Tosa artística", "Secagem", "Perfume", "Laço decorativo"],
			styles: ["Bebê", "Leão", "Poodle", "Personalizada"],
		},
		categories: ["category-2"],
	},
	{
		id: "service-4",
		name: "Banho + Tosa Completa",
		description: "Pacote completo com banho e tosa artística",
		price: 75.00,
		duration: 120,
		companyId: "company-1",
		capacity: 2,
		details: {
			includes: ["Banho completo", "Tosa artística", "Secagem", "Perfume", "Laço decorativo"],
		},
		categories: ["category-4"],
	},

	// Serviços do Mundo Pet (company-2)
	{
		id: "service-5",
		name: "Banho Premium",
		description: "Banho com produtos importados e tratamento especial para peles sensíveis",
		price: 50.00,
		duration: 75,
		companyId: "company-2",
		capacity: 2,
		details: {
			includes: ["Shampoo premium", "Hidratação", "Massagem relaxante", "Perfume francês"],
		},
		categories: ["category-5"],
	},
	{
		id: "service-6",
		name: "Tosa para Pets Pequenos",
		description: "Especializado em cães e gatos de pequeno porte",
		price: 40.00,
		duration: 60,
		companyId: "company-2",
		capacity: 3,
		details: {
			includes: ["Tosa específica", "Cuidado extra", "Brinquedinho"],
			breeds: ["Yorkshire", "Chihuahua", "Maltês", "Poodle Toy"],
		},
		categories: ["category-2"],
	},
	{
		id: "service-7",
		name: "Banho + Tosa Pets Pequenos",
		description: "Pacote completo especializado para pets de pequeno porte",
		price: 65.00,
		duration: 90,
		companyId: "company-2",
		capacity: 2,
		details: {
			includes: ["Banho delicado", "Tosa específica", "Cuidado extra", "Perfume suave"],
			breeds: ["Yorkshire", "Chihuahua", "Maltês", "Poodle Toy"],
		},
		categories: ["category-4"],
	},

	// Serviços do Patas & Cia (company-3)
	{
		id: "service-8",
		name: "Banho Spa",
		description: "Banho com tratamento relaxante e aromaterapia",
		price: 80.00,
		duration: 90,
		companyId: "company-3",
		capacity: 1,
		details: {
			includes: ["Banho aromático", "Massagem", "Hidratação profunda", "Relaxamento"],
			environment: "Ambiente climatizado com música relaxante",
		},
		categories: ["category-5"],
	},
	{
		id: "service-9",
		name: "Tosa Artística Premium",
		description: "Tosa personalizada com técnicas avançadas e acabamento profissional",
		price: 85.00,
		duration: 120,
		companyId: "company-3",
		capacity: 1,
		details: {
			includes: ["Design personalizado", "Secagem profissional", "Fotografia", "Certificado"],
		},
		categories: ["category-2"],
	},
	{
		id: "service-10",
		name: "Pacote Luxury",
		description: "Tratamento completo premium com banho spa e tosa artística",
		price: 150.00,
		duration: 180,
		companyId: "company-3",
		capacity: 1,
		details: {
			includes: ["Banho spa", "Tosa artística premium", "Hidratação", "Fotografia"],
			extras: ["Certificado", "Brinquedo personalizado"],
		},
		categories: ["category-4", "category-5"],
	},

	// Serviços do Cão Panheiro (company-4)
	{
		id: "service-11",
		name: "Banho Express",
		description: "Banho rápido para emergências e necessidades urgentes",
		price: 30.00,
		duration: 45,
		companyId: "company-4",
		capacity: 4,
		details: {
			includes: ["Banho básico", "Secagem rápida", "Perfume"],
		},
		categories: ["category-1"],
	},
	{
		id: "service-12",
		name: "Tosa Higiênica Express",
		description: "Tosa higiênica rápida para manutenção",
		price: 20.00,
		duration: 20,
		companyId: "company-4",
		capacity: 5,
		details: {
			includes: ["Corte higiênico rápido", "Aparação de unhas"],
		},
		categories: ["category-3"],
	},
	{
		id: "service-13",
		name: "Banho + Tosa Express",
		description: "Pacote rápido com banho e tosa básica",
		price: 45.00,
		duration: 75,
		companyId: "company-4",
		capacity: 3,
		details: {
			includes: ["Banho básico", "Tosa simples", "Secagem", "Perfume"],
		},
		categories: ["category-4"],
	},
];

export async function createService(prisma: PrismaClient) {
	// Criar categorias
	for (const category of categories) {
		await prisma.category.upsert({
			where: { id: category.id },
			update: {},
			create: category,
		});
	}

	// Criar serviços
	for (const service of services) {
		const { categories: serviceCategories, ...serviceData } = service;
		
		await prisma.service.upsert({
			where: { id: service.id },
			update: {},
			create: serviceData,
		});

		// Associar serviço às categorias
		for (const categoryId of serviceCategories) {
			await prisma.serviceCategory.upsert({
				where: {
					serviceId_categoryId: {
						serviceId: service.id,
						categoryId,
					},
				},
				update: {},
				create: {
					serviceId: service.id,
					categoryId,
					assignedAt: new Date(),
				},
			});
		}
	}

	// Criar algumas promoções focadas em higiene
	const promotions = [
		{
			id: "promotion-1",
			name: "Primeira Tosa Grátis",
			description: "20% de desconto para novos clientes em qualquer serviço",
			discount: 20.00,
			startDate: new Date("2024-01-01"),
			endDate: new Date("2024-12-31"),
			isActive: true,
		},
		{
			id: "promotion-2",
			name: "Combo Banho + Tosa",
			description: "15% de desconto nos pacotes completos",
			discount: 15.00,
			startDate: new Date("2024-01-01"),
			endDate: new Date("2024-06-30"),
			isActive: true,
		},
		{
			id: "promotion-3",
			name: "Tosa Higiênica Mensal",
			description: "10% de desconto na tosa higiênica para clientes mensais",
			discount: 10.00,
			startDate: new Date("2024-01-01"),
			endDate: new Date("2024-12-31"),
			isActive: true,
		},
	];

	for (const promotion of promotions) {
		await prisma.promotion.upsert({
			where: { id: promotion.id },
			update: {},
			create: promotion,
		});
	}

	// Associar promoções aos serviços
	const servicePromotions = [
		// Promoção primeira visita
		{ serviceId: "service-1", promotionId: "promotion-1" }, // Banho Completo
		{ serviceId: "service-5", promotionId: "promotion-1" }, // Banho Premium
		{ serviceId: "service-11", promotionId: "promotion-1" }, // Banho Express
		
		// Promoção combo banho + tosa
		{ serviceId: "service-4", promotionId: "promotion-2" }, // Banho + Tosa Completa
		{ serviceId: "service-7", promotionId: "promotion-2" }, // Banho + Tosa Pets Pequenos
		{ serviceId: "service-10", promotionId: "promotion-2" }, // Pacote Luxury
		{ serviceId: "service-13", promotionId: "promotion-2" }, // Banho + Tosa Express
		
		// Promoção tosa higiênica mensal
		{ serviceId: "service-2", promotionId: "promotion-3" }, // Tosa Higiênica
		{ serviceId: "service-12", promotionId: "promotion-3" }, // Tosa Higiênica Express
	];

	for (const sp of servicePromotions) {
		await prisma.servicePromotion.upsert({
			where: {
				serviceId_promotionId: sp,
			},
			update: {},
			create: sp,
		});
	}
}
