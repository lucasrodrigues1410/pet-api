import { addDays, addHours, setHours, setMinutes, startOfDay } from "date-fns";
import { PrismaClient } from "prisma/generated/client";

const generateAppointments = () => {
	const appointments: any[] = [];
	const today = startOfDay(new Date());

	// Agendamentos passados (últimos 30 dias)
	for (let i = 30; i > 0; i--) {
		const date = addDays(today, -i);

		// Agendamentos da Pet Shop Bella Cane
		appointments.push({
			id: `appointment-past-${i}-1`,
			startDate: setMinutes(setHours(date, 9), 0),
			endDate: setMinutes(setHours(date, 10), 0),
			status: "completed" as const,
			price: 3500,
			coatType: "short" as const,
			animalId: "animal-1", // Bella (Labrador da Maria)
			serviceId: "service-1", // Banho Completo
			staffId: "user-company-company-1", // Admin da empresa
			clientId: "user-1", // Maria Silva
			companyId: "company-1",
		});

		if (i % 3 === 0) {
			appointments.push({
				id: `appointment-past-${i}-2`,
				startDate: setMinutes(setHours(date, 14), 30),
				endDate: setMinutes(setHours(date, 16), 0),
				status: "completed" as const,
				price: 5500,
				coatType: "long" as const,
				animalId: "animal-13", // Princesa (Maine Coon da Patrícia)
				serviceId: "service-3", // Tosa Completa
				staffId: "user-company-company-1",
				clientId: "user-7", // Patrícia Alves
				companyId: "company-1",
			});
		}
	}

	// Agendamentos futuros (próximos 30 dias)
	for (let i = 1; i <= 30; i++) {
		const date = addDays(today, i);

		// Agendamentos variados nas diferentes empresas
		if (i % 2 === 0) {
			appointments.push({
				id: `appointment-future-${i}-1`,
				startDate: setMinutes(setHours(date, 10), 0),
				endDate: setMinutes(setHours(date, 11), 15),
				status: "scheduled" as const,
				price: 5000,
				coatType: "medium" as const,
				animalId: "animal-6", // Max (Golden Retriever do Carlos)
				serviceId: "service-5", // Banho Premium
				staffId: "user-company-company-2",
				clientId: "user-4", // Carlos Oliveira
				companyId: "company-2",
			});
		}

		if (i % 3 === 0) {
			appointments.push({
				id: `appointment-future-${i}-2`,
				startDate: setMinutes(setHours(date, 15), 0),
				endDate: setMinutes(setHours(date, 17), 0),
				status: "confirmed" as const,
				price: 12000,
				coatType: "curly" as const,
				animalId: "animal-7", // Chocolate (Poodle do Carlos)
				serviceId: "service-8", // Spa Relaxante
				staffId: "user-company-company-3",
				clientId: "user-4", // Carlos Oliveira
				companyId: "company-3",
			});
		}

		if (i % 4 === 0) {
			appointments.push({
				id: `appointment-future-${i}-3`,
				startDate: setMinutes(setHours(date, 8), 0),
				endDate: setMinutes(setHours(date, 8), 0), // Hotel - data de fim será no dia seguinte
				status: "scheduled" as const,
				price: 8000,
				coatType: "short" as const,
				animalId: "animal-15", // Hades (Husky do Bruno)
				serviceId: "service-11", // Hotel Pet
				staffId: "user-company-company-4",
				clientId: "user-8", // Bruno Ferreira
				companyId: "company-4",
			});
		}
	}

	// Alguns agendamentos específicos para hoje e amanhã
	const todayAppointments = [
		{
			id: "appointment-today-1",
			startDate: setMinutes(setHours(today, 9), 0),
			endDate: setMinutes(setHours(today, 9), 30),
			status: "confirmed" as const,
			price: 2500,
			coatType: "short" as const,
			animalId: "animal-8", // Nina (Yorkshire da Fernanda)
			serviceId: "service-2", // Tosa Higiênica
			staffId: "user-company-company-1",
			clientId: "user-5", // Fernanda Lima
			companyId: "company-1",
		},
		{
			id: "appointment-today-2",
			startDate: setMinutes(setHours(today, 11), 0),
			endDate: setMinutes(setHours(today, 11), 45),
			status: "in_progress" as const,
			price: 8000,
			coatType: "medium" as const,
			animalId: "animal-10", // Buddy (Beagle do Ricardo)
			serviceId: "service-4", // Consulta Veterinária
			staffId: "user-company-company-1",
			clientId: "user-6", // Ricardo Pereira
			companyId: "company-1",
		},
		{
			id: "appointment-today-3",
			startDate: setMinutes(setHours(today, 14), 0),
			endDate: setMinutes(setHours(today, 15), 0),
			status: "scheduled" as const,
			price: 4000,
			coatType: "short" as const,
			animalId: "animal-16", // Pequeno (Chihuahua do Bruno)
			serviceId: "service-6", // Tosa para Pets Pequenos
			staffId: "user-company-company-2",
			clientId: "user-8", // Bruno Ferreira
			companyId: "company-2",
		},
	];

	const tomorrowAppointments = [
		{
			id: "appointment-tomorrow-1",
			startDate: setMinutes(setHours(addDays(today, 1), 10), 0),
			endDate: setMinutes(setHours(addDays(today, 1), 12), 30),
			status: "scheduled" as const,
			price: 15000,
			coatType: "medium" as const,
			animalId: "animal-12", // Zeus (Border Collie da Patrícia)
			serviceId: "service-10", // Adestramento Básico
			staffId: "user-company-company-3",
			clientId: "user-7", // Patrícia Alves
			companyId: "company-3",
		},
		{
			id: "appointment-tomorrow-2",
			startDate: setMinutes(setHours(addDays(today, 1), 16), 0),
			endDate: setMinutes(setHours(addDays(today, 1), 18), 30),
			status: "confirmed" as const,
			price: 14000,
			coatType: "long" as const,
			animalId: "animal-3", // Thor (Pastor Alemão do João)
			serviceId: "service-13", // Pacote Completo
			staffId: "user-company-company-4",
			clientId: "user-2", // João Santos
			companyId: "company-4",
		},
	];

	// Alguns agendamentos cancelados ou não compareceu
	const problematicAppointments = [
		{
			id: "appointment-canceled-1",
			startDate: setMinutes(setHours(addDays(today, -5), 14), 0),
			endDate: setMinutes(setHours(addDays(today, -5), 15), 30),
			status: "canceled" as const,
			price: 8500,
			coatType: "curly" as const,
			animalId: "animal-5", // Simba (Siamês da Ana)
			serviceId: "service-9", // Tosa Artística Premium
			staffId: "user-company-company-3",
			clientId: "user-3", // Ana Costa
			companyId: "company-3",
		},
		{
			id: "appointment-noshow-1",
			startDate: setMinutes(setHours(addDays(today, -2), 9), 0),
			endDate: setMinutes(setHours(addDays(today, -2), 10), 0),
			status: "no_show" as const,
			price: 6000,
			coatType: "short" as const,
			animalId: "animal-11", // Mel (Shih Tzu do Ricardo)
			serviceId: "service-7", // Day Care
			staffId: "user-company-company-2",
			clientId: "user-6", // Ricardo Pereira
			companyId: "company-2",
		},
	];

	return [
		...appointments,
		...todayAppointments,
		...tomorrowAppointments,
		...problematicAppointments,
	];
};

export async function createAppointment(prisma: PrismaClient) {
	const appointments = generateAppointments();

	for (const appointment of appointments) {
		// Ajustar endDate para serviços de hotel (24h)
		if (appointment.serviceId === "service-11") {
			appointment.endDate = addHours(appointment.startDate, 24);
		}

		await prisma.appointment.upsert({
			where: { id: appointment.id },
			update: {},
			create: appointment,
		});
	}
}
