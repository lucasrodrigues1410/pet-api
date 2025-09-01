import { addDays, addHours } from "date-fns";
import { PrismaClient } from "prisma/generated/client";

const generateNotifications = () => {
	const now = new Date();

	// Notificações de confirmação de agendamento
	const confirmationNotifications = [
		{
			id: "notification-1",
			userId: "user-1", // Maria Silva
			type: "appointment_confirmed",
			message:
				"Seu agendamento para banho da Bella foi confirmado para amanhã às 09:00 na Pet Shop Bella Cane.",
			read: false,
			createdAt: addHours(now, -2),
		},
		{
			id: "notification-2",
			userId: "user-4", // Carlos Oliveira
			type: "appointment_confirmed",
			message:
				"Agendamento confirmado! O Max tem spa relaxante marcado para hoje às 15:00 no Patas & Cia.",
			read: true,
			createdAt: addHours(now, -6),
		},
		{
			id: "notification-3",
			userId: "user-7", // Patrícia Alves
			type: "appointment_confirmed",
			message:
				"Confirmado: Adestramento do Zeus amanhã às 10:00 no Patas & Cia Pet Care.",
			read: false,
			createdAt: addHours(now, -1),
		},
	];

	// Notificações de lembrete
	const reminderNotifications = [
		{
			id: "notification-4",
			userId: "user-5", // Fernanda Lima
			type: "appointment_reminder",
			message:
				"Lembrete: Tosa higiênica da Nina hoje às 09:00 na Pet Shop Bella Cane. Não se esqueça!",
			read: false,
			createdAt: addHours(now, -1),
		},
		{
			id: "notification-5",
			userId: "user-6", // Ricardo Pereira
			type: "appointment_reminder",
			message:
				"Consulta veterinária do Buddy hoje às 11:00. Por favor, traga a carteira de vacinação.",
			read: true,
			createdAt: addHours(now, -3),
		},
		{
			id: "notification-6",
			userId: "user-8", // Bruno Ferreira
			type: "appointment_reminder",
			message:
				"Lembrete: Tosa do Pequeno hoje às 14:00 no Mundo Pet. Especializada em pets pequenos!",
			read: false,
			createdAt: addHours(now, -4),
		},
	];

	// Notificações de promoções
	const promotionNotifications = [
		{
			id: "notification-7",
			userId: "user-1", // Maria Silva
			type: "promotion",
			message:
				"🎉 Oferta especial! 20% de desconto na primeira visita para novos serviços. Válido até o final do mês!",
			read: false,
			createdAt: addDays(now, -1),
		},
		{
			id: "notification-8",
			userId: "user-2", // João Santos
			type: "promotion",
			message:
				"💰 Combo imperdível! 15% OFF na tosa quando feita junto com banho. Aproveite!",
			read: true,
			createdAt: addDays(now, -2),
		},
		{
			id: "notification-9",
			userId: "user-3", // Ana Costa
			type: "promotion",
			message:
				"🐕 Mês do Pet! Pacote completo (banho + tosa + consulta) com desconto especial.",
			read: false,
			createdAt: addDays(now, -3),
		},
	];

	// Notificações de serviço completado
	const completedNotifications = [
		{
			id: "notification-10",
			userId: "user-1", // Maria Silva
			type: "service_completed",
			message:
				"Serviço concluído! A Bella está pronta para buscar. Que tal avaliar nosso atendimento?",
			read: true,
			createdAt: addHours(now, -24),
		},
		{
			id: "notification-11",
			userId: "user-7", // Patrícia Alves
			type: "service_completed",
			message:
				"Tosa da Princesa finalizada com sucesso! Ela está linda e cheirosa. Obrigado pela preferência! ✨",
			read: true,
			createdAt: addDays(now, -2),
		},
		{
			id: "notification-12",
			userId: "user-4", // Carlos Oliveira
			type: "service_completed",
			message:
				"Spa do Chocolate concluído! Ele está completamente relaxado e feliz. Até a próxima! 🐾",
			read: false,
			createdAt: addHours(now, -12),
		},
	];

	// Notificações de cancelamento
	const cancellationNotifications = [
		{
			id: "notification-13",
			userId: "user-3", // Ana Costa
			type: "appointment_cancelled",
			message:
				"Seu agendamento foi cancelado conforme solicitado. Esperamos atendê-la em breve!",
			read: true,
			createdAt: addDays(now, -5),
		},
	];

	// Notificações do sistema
	const systemNotifications = [
		{
			id: "notification-14",
			userId: "user-8", // Bruno Ferreira
			type: "hotel_update",
			message:
				"Relatório do hotel: Hades teve um ótimo dia! Brincou bastante e comeu toda a ração. Fotos no app! 📸",
			read: false,
			createdAt: addHours(now, -8),
		},
		{
			id: "notification-15",
			userId: "user-6", // Ricardo Pereira
			type: "vaccination_reminder",
			message:
				"⚕️ Lembrete: A vacina do Buddy vence em 30 dias. Agende uma consulta veterinária!",
			read: false,
			createdAt: addDays(now, -1),
		},
		{
			id: "notification-16",
			userId: "user-5", // Fernanda Lima
			type: "birthday_reminder",
			message:
				"🎂 Aniversário da Nina se aproxima! Que tal um spa especial para comemorar?",
			read: false,
			createdAt: addDays(now, -7),
		},
	];

	return [
		...confirmationNotifications,
		...reminderNotifications,
		...promotionNotifications,
		...completedNotifications,
		...cancellationNotifications,
		...systemNotifications,
	];
};

export async function createNotification(prisma: PrismaClient) {
	const notifications = generateNotifications();

	for (const notification of notifications) {
		await prisma.notification.upsert({
			where: { id: notification.id },
			update: {},
			create: notification,
		});
	}
}
