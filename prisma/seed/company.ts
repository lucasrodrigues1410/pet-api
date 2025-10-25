import { set } from "date-fns";
import { PrismaClient } from "prisma/generated/client";
import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";

const companies = [
	{
		id: "company-1",
		name: "Pet Shop Bella Cane",
		contact: "(11) 3456-7890",
		description: "Pet shop completo com serviços de banho, tosa e cuidados veterinários. Atendemos todas as raças com carinho e profissionalismo há mais de 10 anos.",
		averageRating: 4.8,
		ratingCount: 156,
		ownerId: "company-user-1",
		locationId: "1",
		logo: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center",
		sampleImages: [
			"https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=600&fit=crop&crop=center",
			"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop&crop=center",
			"https://images.unsplash.com/photo-1581888227599-779811939961?w=800&h=600&fit=crop&crop=center"
		],
	},
	{
		id: "company-2", 
		name: "Mundo Pet - Cuidados Especiais",
		contact: "(11) 9876-5432",
		description: "Especialistas em cuidados para pets de pequeno porte. Oferecemos serviços personalizados e produtos premium para seu melhor amigo.",
		averageRating: 4.6,
		ratingCount: 89,
		ownerId: "company-user-2",
		locationId: "2",
		logo: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=400&h=400&fit=crop&crop=center",
		sampleImages: [
			"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop&crop=center",
			"https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop&crop=center",
			"https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&h=600&fit=crop&crop=center"
		],
	},
	{
		id: "company-3",
		name: "Patas & Cia Pet Care",
		contact: "(11) 2345-6789",
		description: "Centro completo de estética e bem-estar animal. Banho, tosa, spa relaxante e muito mais para deixar seu pet sempre belo e saudável.",
		averageRating: 4.9,
		ratingCount: 203,
		ownerId: "company-user-3",
		locationId: "3",
		logo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&crop=center",
		sampleImages: [
			"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center",
			"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&crop=center",
			"https://images.unsplash.com/photo-1555169062-013468b47731?w=800&h=600&fit=crop&crop=center"
		],
	},
	{
		id: "company-4",
		name: "Cão Panheiro - Pet Shop & Hotel",
		contact: "(11) 5555-1234",
		description: "Além dos serviços tradicionais de pet shop, oferecemos hospedagem para seu pet quando você precisar viajar. Ambiente seguro e acolhedor.",
		averageRating: 4.7,
		ratingCount: 134,
		ownerId: "company-user-4",
		locationId: "4",
		logo: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop&crop=center",
		sampleImages: [
			"https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&h=600&fit=crop&crop=center",
			"https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&h=600&fit=crop&crop=center",
			"https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop&crop=center"
		],
	},
];

const companySchedules = [
	// Pet Shop Bella Cane - Horário comercial padrão
	{
		companyId: "company-1",
		schedule: {
			weekdays: { start: 8, end: 18, lunchStart: 12, lunchEnd: 13 },
			saturday: { start: 8, end: 16, lunchStart: 12, lunchEnd: 13 },
			sunday: { start: 9, end: 15, lunchStart: null, lunchEnd: null },
		}
	},
	// Mundo Pet - Horário estendido
	{
		companyId: "company-2",
		schedule: {
			weekdays: { start: 7, end: 19, lunchStart: 12, lunchEnd: 13 },
			saturday: { start: 7, end: 17, lunchStart: 12, lunchEnd: 13 },
			sunday: { start: 8, end: 16, lunchStart: null, lunchEnd: null },
		}
	},
	// Patas & Cia - Horário luxury
	{
		companyId: "company-3",
		schedule: {
			weekdays: { start: 9, end: 18, lunchStart: 12, lunchEnd: 14 },
			saturday: { start: 9, end: 17, lunchStart: 12, lunchEnd: 14 },
			sunday: { start: 10, end: 16, lunchStart: null, lunchEnd: null },
		}
	},
	// Cão Panheiro - 24h disponível para hotel
	{
		companyId: "company-4",
		schedule: {
			weekdays: { start: 6, end: 20, lunchStart: 12, lunchEnd: 13 },
			saturday: { start: 6, end: 20, lunchStart: 12, lunchEnd: 13 },
			sunday: { start: 7, end: 19, lunchStart: 12, lunchEnd: 13 },
		}
	},
];

export async function createCompany(prisma: PrismaClient) {
	// Criar empresas
	for (const company of companies) {
		const { ownerId, sampleImages, logo, ...companyData } = company;
		
		// Criar asset para o logo
		let logoAssetId: string | undefined;
		if (logo) {
			const logoAsset = await prisma.asset.upsert({
				where: { name: `logo-${company.id}` },
				update: {},
				create: {
					id: `logo-asset-${company.id}`,
					name: `logo-${company.id}`,
					url: logo,
					fileType: "image/jpeg",
					width: 400,
					height: 400,
					userId: ownerId,
				},
			});
			logoAssetId = logoAsset.id;
		}

		// Criar empresa com referência ao logo
		await prisma.company.upsert({
			where: { id: company.id },
			update: {},
			create: {
				...companyData,
				logoAssetId,
			},
		});

		// Criar relação usuário-empresa
		await prisma.userCompany.upsert({
			where: { id: `user-company-${company.id}` },
			update: {},
			create: {
				id: `user-company-${company.id}`,
				userId: ownerId,
				companyId: company.id,
				role: "admin",
			},
		});

		// Criar assets e imagens de amostra para a empresa
		if (sampleImages && sampleImages.length > 0) {
			for (let i = 0; i < sampleImages.length; i++) {
				// Criar asset para a imagem
				const imageAsset = await prisma.asset.upsert({
					where: { name: `${company.id}-image-${i + 1}` },
					update: {},
					create: {
						id: `image-asset-${company.id}-${i + 1}`,
						name: `${company.id}-image-${i + 1}`,
						url: sampleImages[i],
						fileType: "image/jpeg",
						width: 800,
						height: 600,
						userId: ownerId,
					},
				});

				// Criar relação CompanyImage
				await prisma.companyImage.upsert({
					where: { id: `${company.id}-image-${i + 1}` },
					update: {},
					create: {
						id: `${company.id}-image-${i + 1}`,
						companyId: company.id,
						assetId: imageAsset.id,
					},
				});
			}
		}
	}

	// Criar horários de funcionamento
	for (const { companyId, schedule } of companySchedules) {
		for (const day of daysOfWeek) {
			let daySchedule;
			
			if (day === 'saturday') {
				daySchedule = schedule.saturday;
			} else if (day === 'sunday') {
				daySchedule = schedule.sunday;
			} else {
				daySchedule = schedule.weekdays;
			}

			await prisma.companyAvailability.upsert({
				where: { id: `${companyId}-${day}` },
				update: {},
				create: {
					id: `${companyId}-${day}`,
					companyId,
					day: day as any,
					startTime: set(new Date(), {
						hours: daySchedule.start,
						minutes: 0,
						seconds: 0,
						milliseconds: 0,
					}).toISOString(),
					endTime: set(new Date(), {
						hours: daySchedule.end,
						minutes: 0,
						seconds: 0,
						milliseconds: 0,
					}).toISOString(),
					lunchStartTime: daySchedule.lunchStart ? set(new Date(), {
						hours: daySchedule.lunchStart,
						minutes: 0,
						seconds: 0,
						milliseconds: 0,
					}).toISOString() : set(new Date(), {
						hours: 12,
						minutes: 0,
						seconds: 0,
						milliseconds: 0,
					}).toISOString(),
					lunchEndTime: daySchedule.lunchEnd ? set(new Date(), {
						hours: daySchedule.lunchEnd,
						minutes: 0,
						seconds: 0,
						milliseconds: 0,
					}).toISOString() : set(new Date(), {
						hours: 13,
						minutes: 0,
						seconds: 0,
						milliseconds: 0,
					}).toISOString(),
				},
			});
		}
	}

	// Adicionar alguns funcionários extras
	const employees = [
		{ userId: "company-user-2", companyId: "company-1", role: "member" as const },
		{ userId: "company-user-3", companyId: "company-1", role: "member" as const },
		{ userId: "company-user-1", companyId: "company-2", role: "member" as const },
		{ userId: "company-user-4", companyId: "company-3", role: "member" as const },
	];

	for (const employee of employees) {
		await prisma.userCompany.upsert({
			where: { id: `employee-${employee.userId}-${employee.companyId}` },
			update: {},
			create: {
				id: `employee-${employee.userId}-${employee.companyId}`,
				...employee,
			},
		});
	}
}
