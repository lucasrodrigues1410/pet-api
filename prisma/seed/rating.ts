import { PrismaClient } from "prisma/generated/client";

const ratings = [
	// Avaliações para Pet Shop Bella Cane (company-1)
	{
		id: "rating-1",
		companyId: "company-1",
		userId: "user-1", // Maria Silva
		rating: 5,
		comment: "Excelente atendimento! A Bella ficou linda depois do banho e tosa. Equipe muito cuidadosa e carinhosa com os animais.",
	},
	{
		id: "rating-2",
		companyId: "company-1",
		userId: "user-5", // Fernanda Lima
		rating: 5,
		comment: "Adorei o serviço! A Nina é muito pequena e delicada, mas foram super cuidadosos. Preço justo e qualidade excelente.",
	},
	{
		id: "rating-3",
		companyId: "company-1",
		userId: "user-6", // Ricardo Pereira
		rating: 4,
		comment: "Bom atendimento, mas tive que esperar um pouco além do horário marcado. O resultado final foi muito bom.",
	},
	{
		id: "rating-4",
		companyId: "company-1",
		userId: "user-7", // Patrícia Alves
		rating: 5,
		comment: "Fantástico! O Zeus ficou irreconhecível depois da tosa. Profissionais muito competentes e ambiente limpo.",
	},

	// Avaliações para Mundo Pet (company-2)
	{
		id: "rating-5",
		companyId: "company-2",
		userId: "user-4", // Carlos Oliveira
		rating: 4,
		comment: "Serviço premium realmente vale a pena. O Max adorou o banho com produtos especiais. Voltarei com certeza.",
	},
	{
		id: "rating-6",
		companyId: "company-2",
		userId: "user-8", // Bruno Ferreira
		rating: 5,
		comment: "Especialistas em pets pequenos mesmo! O Pequeno ficou perfeito. Atendimento personalizado e muito cuidado.",
	},
	{
		id: "rating-7",
		companyId: "company-2",
		userId: "user-6", // Ricardo Pereira
		rating: 3,
		comment: "O serviço de day care é bom, mas achei um pouco caro. A Mel voltou bem cuidada, mas esperava mais pelo preço.",
	},

	// Avaliações para Patas & Cia (company-3)
	{
		id: "rating-8",
		companyId: "company-3",
		userId: "user-4", // Carlos Oliveira
		rating: 5,
		comment: "O spa foi incrível! O Chocolate saiu de lá completamente relaxado. Ambiente luxuoso e serviço impecável.",
	},
	{
		id: "rating-9",
		companyId: "company-3",
		userId: "user-7", // Patrícia Alves
		rating: 5,
		comment: "Adestramento excelente! O Zeus já está obedecendo os comandos básicos. Profissional muito experiente.",
	},
	{
		id: "rating-10",
		companyId: "company-3",
		userId: "user-3", // Ana Costa (cancelou um agendamento)
		rating: 4,
		comment: "Tive que cancelar um agendamento, mas o atendimento foi muito compreensivo. Ambiente muito bonito e profissional.",
	},

	// Avaliações para Cão Panheiro (company-4)
	{
		id: "rating-11",
		companyId: "company-4",
		userId: "user-2", // João Santos
		rating: 5,
		comment: "Pacote completo vale muito a pena! O Thor recebeu todos os cuidados em um só lugar. Muito prático e eficiente.",
	},
	{
		id: "rating-12",
		companyId: "company-4",
		userId: "user-8", // Bruno Ferreira
		rating: 4,
		comment: "Hotel pet muito bom. O Hades ficou bem cuidado durante minha viagem. Recebi relatórios diários por WhatsApp.",
	},
	{
		id: "rating-13",
		companyId: "company-4",
		userId: "user-1", // Maria Silva
		rating: 4,
		comment: "Banho express salvou meu dia! A Bella estava muito suja e precisava sair rapidamente. Atendimento ágil.",
	},

	// Algumas avaliações mais antigas
	{
		id: "rating-14",
		companyId: "company-1",
		userId: "user-2", // João Santos
		rating: 5,
		comment: "Já trouxe meus pets várias vezes. Sempre saem lindos e cheirosos. Equipe de confiança!",
	},
	{
		id: "rating-15",
		companyId: "company-2",
		userId: "user-3", // Ana Costa
		rating: 4,
		comment: "Bom custo-benefício. A Luna gostou muito do banho e da atenção recebida.",
	},
];

export async function createRating(prisma: PrismaClient) {
	for (const rating of ratings) {
		await prisma.rating.upsert({
			where: { id: rating.id },
			update: {},
			create: {
				...rating,
				createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Últimos 90 dias
			},
		});
	}
}
