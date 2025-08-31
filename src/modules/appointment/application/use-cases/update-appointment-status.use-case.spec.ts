import { beforeEach, describe, expect, it } from "bun:test";
import { CommandBus } from "@nestjs/cqrs";
import { makeAppointment } from "test/factories/make-appointment";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { UpdateAppointmentStatusUseCase } from "./update-appointment-status.use-case";

let useCase: UpdateAppointmentStatusUseCase;
let appointmentRepository: InMemoryAppointmentRepository;
let commandBus: CommandBus;

describe("UpdateAppointmentStatusUseCase", () => {
	const mockAppointment = makeAppointment(
		{
			status: "scheduled",
			companyId: new UniqueEntityID("company-1"),
			animalId: new UniqueEntityID("animal-1"),
			clientId: new UniqueEntityID("client-1"),
			serviceId: new UniqueEntityID("service-1"),
		},
		new UniqueEntityID("appointment-1"),
	);

	beforeEach(async () => {
		appointmentRepository = new InMemoryAppointmentRepository();
		commandBus = {
			execute: async () => {},
		} as unknown as CommandBus;
		useCase = new UpdateAppointmentStatusUseCase(
			appointmentRepository,
			commandBus,
		);
	});

	describe("Cliente atualizando status", () => {
		it("deve permitir cliente cancelar seu próprio agendamento", async () => {
			appointmentRepository.items = [mockAppointment];

			const result = await useCase.execute({
				appointmentId: "appointment-1",
				newStatus: "canceled",
				userId: "client-1",
				userType: "customer",
			});

			expect(result.isRight()).toBe(true);
			expect(appointmentRepository.items).toHaveLength(1);
		});

		it("deve impedir cliente de definir status NO_SHOW", async () => {
			appointmentRepository.items = [mockAppointment];

			const result = await useCase.execute({
				appointmentId: "appointment-1",
				newStatus: "no_show",
				userId: "client-1",
				userType: "customer",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(NotAllowedError);
		});

		it("deve impedir cliente de acessar agendamento de outro cliente", async () => {
			appointmentRepository.items = [mockAppointment];

			const result = await useCase.execute({
				appointmentId: "appointment-1",
				newStatus: "canceled",
				userId: "other-client",
				userType: "customer",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(NotAllowedError);
		});
	});

	describe("Empresa atualizando status", () => {
		it("deve permitir empresa definir status NO_SHOW", async () => {
			appointmentRepository.items = [
				makeAppointment(
					{
						status: "scheduled",
						companyId: new UniqueEntityID("company-1"),
						animalId: new UniqueEntityID("animal-1"),
						clientId: new UniqueEntityID("client-1"),
						serviceId: new UniqueEntityID("service-1"),
					},
					new UniqueEntityID("appointment-1"),
				),
			];

			const result = await useCase.execute({
				appointmentId: "appointment-1",
				newStatus: "no_show",
				userId: "staff-1",
				userType: "company",
				companyId: "company-1",
			});

			expect(result.isRight()).toBe(true);
			expect(appointmentRepository.items).toHaveLength(1);
		});

		it("deve impedir empresa de acessar agendamento de outra empresa", async () => {
			appointmentRepository.items = [mockAppointment];

			const result = await useCase.execute({
				appointmentId: "appointment-1",
				newStatus: "completed",
				userId: "staff-1",
				userType: "company",
				companyId: "other-company",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(NotAllowedError);
		});
	});

	describe("Casos de erro", () => {
		it("deve retornar erro quando agendamento não existe", async () => {
			appointmentRepository.items = [];

			const result = await useCase.execute({
				appointmentId: "non-existent",
				newStatus: "canceled",
				userId: "client-1",
				userType: "customer",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		});

		it("deve retornar erro para transição inválida de status", async () => {
			const completedAppointment = makeAppointment(
				{
					status: "completed",
				},
				new UniqueEntityID("appointment-1"),
			);

			appointmentRepository.items = [completedAppointment];

			const result = await useCase.execute({
				appointmentId: "appointment-1",
				newStatus: "scheduled",
				userId: "client-1",
				userType: "customer",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(NotAllowedError);
		});
	});
});
