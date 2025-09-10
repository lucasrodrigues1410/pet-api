import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAppointment } from "test/factories/make-appointment";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { GetAppointmentByIdUseCase } from "./get-appointment-by-id.use-case";

describe("GetAppointmentByIdUseCase", () => {
	let moduleRef: any;
	let sut: GetAppointmentByIdUseCase;

	const mockAppointmentRepo = {
		findById: jest.fn(),
		findByUserId: jest.fn(),
		findByCompanyId: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	beforeEach(async () => {
		mockAppointmentRepo.findById.mockReset();
		mockAppointmentRepo.findByUserId.mockReset();
		mockAppointmentRepo.findByCompanyId.mockReset();
		mockAppointmentRepo.create.mockReset();
		mockAppointmentRepo.update.mockReset();
		mockAppointmentRepo.delete.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				GetAppointmentByIdUseCase,
				{ provide: AppointmentRepository, useValue: mockAppointmentRepo },
			],
		}).compile();

		sut = moduleRef.get(GetAppointmentByIdUseCase);
	});

	it("should return an appointment if it exists", async () => {
		const appointment = makeAppointment();
		mockAppointmentRepo.findById.mockResolvedValueOnce(appointment);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: appointment.clientId.toString(),
			userType: "customer",
		});

		expect(result.isRight()).toBe(true);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			appointment.id.toString(),
		);
	});

	it("should return ResourceNotFoundError if appointment does not exist", async () => {
		mockAppointmentRepo.findById.mockResolvedValueOnce(null);

		const result = await sut.execute({
			id: "non-existing-id",
			userId: "user-1",
			userType: "customer",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			"non-existing-id",
		);
	});

	it("should return ResourceNotFoundError if customer tries to access another customer's appointment", async () => {
		const appointment = makeAppointment();
		mockAppointmentRepo.findById.mockResolvedValueOnce(appointment);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: "different-user-id",
			userType: "customer",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			appointment.id.toString(),
		);
	});

	it("should return appointment for company user with correct companyId", async () => {
		const appointment = makeAppointment();
		mockAppointmentRepo.findById.mockResolvedValueOnce(appointment);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: "staff-1",
			userType: "company",
			companyId: appointment.companyId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			appointment.id.toString(),
		);
	});

	it("should return ResourceNotFoundError if company tries to access another company's appointment", async () => {
		const appointment = makeAppointment();
		mockAppointmentRepo.findById.mockResolvedValueOnce(appointment);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: "staff-1",
			userType: "company",
			companyId: "different-company-id",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			appointment.id.toString(),
		);
	});
});
