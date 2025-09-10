import { beforeEach, describe, expect, it, jest } from "bun:test";
import { CommandBus } from "@nestjs/cqrs";
import { Test } from "@nestjs/testing";
import { makeAppointment } from "test/factories/make-appointment";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { UpdateAppointmentStatusUseCase } from "./update-appointment-status.use-case";

let moduleRef: any;
let sut: UpdateAppointmentStatusUseCase;

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

	const mockAppointmentRepo = {
		findById: jest.fn(),
		findByUserId: jest.fn(),
		findByCompanyId: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		updateStatus: jest.fn(),
		delete: jest.fn(),
	};

	const mockCommandBus = { execute: jest.fn() };

	beforeEach(async () => {
		mockAppointmentRepo.findById.mockReset();
		mockAppointmentRepo.findByUserId.mockReset();
		mockAppointmentRepo.findByCompanyId.mockReset();
		mockAppointmentRepo.create.mockReset();
		mockAppointmentRepo.update.mockReset();
		mockAppointmentRepo.updateStatus.mockReset();
		mockAppointmentRepo.delete.mockReset();
		mockCommandBus.execute.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				UpdateAppointmentStatusUseCase,
				{ provide: AppointmentRepository, useValue: mockAppointmentRepo },
				{ provide: CommandBus, useValue: mockCommandBus },
			],
		}).compile();

		sut = moduleRef.get(UpdateAppointmentStatusUseCase);
	});

	describe("Cliente atualizando status", () => {
		it("deve permitir cliente cancelar seu próprio agendamento", async () => {
			const appointment = makeAppointment(
				{
					status: "scheduled",
					companyId: new UniqueEntityID("company-1"),
					animalId: new UniqueEntityID("animal-1"),
					clientId: new UniqueEntityID("client-1"),
					serviceId: new UniqueEntityID("service-1"),
				},
				new UniqueEntityID("appointment-1"),
			);

			const appointmentWithRelations = Object.assign(appointment, {
				client: { name: "Client Name", email: "client@email.com" },
				animal: { name: "Pet Name" },
				service: { name: "Service Name" },
				company: { name: "Company Name" },
			});

			mockAppointmentRepo.findById.mockResolvedValueOnce(
				appointmentWithRelations,
			);
			mockAppointmentRepo.updateStatus.mockResolvedValueOnce(undefined);

			const result = await sut.execute({
				appointmentId: "appointment-1",
				newStatus: "canceled",
				userId: "client-1",
				userType: "customer",
			});

			expect(result.isRight()).toBe(true);
			expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
				"appointment-1",
			);
			expect(mockAppointmentRepo.updateStatus).toHaveBeenCalledWith(
				"appointment-1",
				"canceled",
			);
		});

		it("deve impedir cliente de definir status NO_SHOW", async () => {
			mockAppointmentRepo.findById.mockResolvedValueOnce(mockAppointment);

			const result = await sut.execute({
				appointmentId: "appointment-1",
				newStatus: "no_show",
				userId: "client-1",
				userType: "customer",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(NotAllowedError);
			expect(mockAppointmentRepo.updateStatus).not.toHaveBeenCalled();
		});

		it("deve impedir cliente de acessar agendamento de outro cliente", async () => {
			mockAppointmentRepo.findById.mockResolvedValueOnce(mockAppointment);

			const result = await sut.execute({
				appointmentId: "appointment-1",
				newStatus: "canceled",
				userId: "other-client",
				userType: "customer",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(NotAllowedError);
			expect(mockAppointmentRepo.updateStatus).not.toHaveBeenCalled();
		});
	});

	describe("Empresa atualizando status", () => {
		it("deve permitir empresa definir status NO_SHOW", async () => {
			const companyAppointment = makeAppointment(
				{
					status: "scheduled",
					companyId: new UniqueEntityID("company-1"),
					animalId: new UniqueEntityID("animal-1"),
					clientId: new UniqueEntityID("client-1"),
					serviceId: new UniqueEntityID("service-1"),
				},
				new UniqueEntityID("appointment-1"),
			);

			const appointmentWithRelations = Object.assign(companyAppointment, {
				client: { name: "Client Name", email: "client@email.com" },
				animal: { name: "Pet Name" },
				service: { name: "Service Name" },
				company: { name: "Company Name" },
			});

			mockAppointmentRepo.findById.mockResolvedValueOnce(
				appointmentWithRelations,
			);
			mockAppointmentRepo.updateStatus.mockResolvedValueOnce(undefined);

			const result = await sut.execute({
				appointmentId: "appointment-1",
				newStatus: "no_show",
				userId: "staff-1",
				userType: "company",
				companyId: "company-1",
			});

			expect(result.isRight()).toBe(true);
			expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
				"appointment-1",
			);
			expect(mockAppointmentRepo.updateStatus).toHaveBeenCalledWith(
				"appointment-1",
				"no_show",
			);
		});

		it("deve impedir empresa de acessar agendamento de outra empresa", async () => {
			mockAppointmentRepo.findById.mockResolvedValueOnce(mockAppointment);

			const result = await sut.execute({
				appointmentId: "appointment-1",
				newStatus: "completed",
				userId: "staff-1",
				userType: "company",
				companyId: "other-company",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(NotAllowedError);
			expect(mockAppointmentRepo.updateStatus).not.toHaveBeenCalled();
		});
	});

	describe("Casos de erro", () => {
		it("deve retornar erro quando agendamento não existe", async () => {
			mockAppointmentRepo.findById.mockResolvedValueOnce(null);

			const result = await sut.execute({
				appointmentId: "non-existent",
				newStatus: "canceled",
				userId: "client-1",
				userType: "customer",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
			expect(mockAppointmentRepo.findById).toHaveBeenCalledWith("non-existent");
			expect(mockAppointmentRepo.updateStatus).not.toHaveBeenCalled();
		});

		it("deve retornar erro para transição inválida de status", async () => {
			const completedAppointment = makeAppointment(
				{ status: "completed" },
				new UniqueEntityID("appointment-1"),
			);

			mockAppointmentRepo.findById.mockResolvedValueOnce(completedAppointment);

			const result = await sut.execute({
				appointmentId: "appointment-1",
				newStatus: "scheduled",
				userId: "client-1",
				userType: "customer",
			});

			expect(result.isLeft()).toBe(true);
			expect(result.value).toBeInstanceOf(NotAllowedError);
			expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
				"appointment-1",
			);
			expect(mockAppointmentRepo.updateStatus).not.toHaveBeenCalled();
		});
	});
});
