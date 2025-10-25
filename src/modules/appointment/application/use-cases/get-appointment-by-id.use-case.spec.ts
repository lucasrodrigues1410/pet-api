import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAppointment } from "test/factories/make-appointment";
import { makeStaff } from "test/factories/make-staff";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
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

	const mockStaffRepo = {
		findByUserEmail: jest.fn(),
		findById: jest.fn(),
		findByUserId: jest.fn(),
		findByCompanyId: jest.fn(),
		fetchCompanyStaffWithAppointmentsInDateRange: jest.fn(),
		findAvailableForSlot: jest.fn(),
		create: jest.fn(),
		delete: jest.fn(),
		totalStaffByCompanyId: jest.fn(),
	};

	beforeEach(async () => {
		mockAppointmentRepo.findById.mockReset();
		mockAppointmentRepo.findByUserId.mockReset();
		mockAppointmentRepo.findByCompanyId.mockReset();
		mockAppointmentRepo.create.mockReset();
		mockAppointmentRepo.update.mockReset();
		mockAppointmentRepo.delete.mockReset();
		mockStaffRepo.findByUserEmail.mockReset();
		mockStaffRepo.findById.mockReset();
		mockStaffRepo.findByUserId.mockReset();
		mockStaffRepo.findByCompanyId.mockReset();
		mockStaffRepo.fetchCompanyStaffWithAppointmentsInDateRange.mockReset();
		mockStaffRepo.findAvailableForSlot.mockReset();
		mockStaffRepo.create.mockReset();
		mockStaffRepo.delete.mockReset();
		mockStaffRepo.totalStaffByCompanyId.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				GetAppointmentByIdUseCase,
				{ provide: AppointmentRepository, useValue: mockAppointmentRepo },
				{ provide: StaffRepository, useValue: mockStaffRepo },
			],
		}).compile();

		sut = moduleRef.get(GetAppointmentByIdUseCase);
	});

	it("should return an appointment if it exists", async () => {
		const clientId = new UniqueEntityID("client-1");
		const appointment = makeAppointment({ clientId });

		mockAppointmentRepo.findById.mockResolvedValueOnce(appointment);
		mockStaffRepo.findByUserId.mockResolvedValueOnce(null);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: clientId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			appointment.id.toString(),
		);
		expect(mockStaffRepo.findByUserId).toHaveBeenCalledWith(
			clientId.toString(),
		);
	});

	it("should return ResourceNotFoundError if appointment does not exist", async () => {
		mockAppointmentRepo.findById.mockResolvedValueOnce(null);

		const result = await sut.execute({
			id: "non-existing-id",
			userId: "user-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			"non-existing-id",
		);
		expect(mockStaffRepo.findByUserId).not.toHaveBeenCalled();
	});

	it("should return ResourceNotFoundError if customer tries to access another customer's appointment", async () => {
		const clientId = new UniqueEntityID("client-1");
		const differentUserId = "different-user-id";
		const appointment = makeAppointment({ clientId });

		mockAppointmentRepo.findById.mockResolvedValueOnce(appointment);
		mockStaffRepo.findByUserId.mockResolvedValueOnce(null);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: differentUserId,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			appointment.id.toString(),
		);
		expect(mockStaffRepo.findByUserId).toHaveBeenCalledWith(differentUserId);
	});

	it("should return appointment for company user with correct companyId", async () => {
		const companyId = new UniqueEntityID("company-1");
		const staffUserId = new UniqueEntityID("staff-1");
		const clientId = new UniqueEntityID("client-1");

		const appointment = makeAppointment({ companyId, clientId });
		const staff = makeStaff({ userId: staffUserId, companyId });

		mockAppointmentRepo.findById.mockResolvedValueOnce(appointment);
		mockStaffRepo.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: staffUserId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			appointment.id.toString(),
		);
		expect(mockStaffRepo.findByUserId).toHaveBeenCalledWith(
			staffUserId.toString(),
		);
	});

	it("should return ResourceNotFoundError if company tries to access another company's appointment", async () => {
		const companyId = new UniqueEntityID("company-1");
		const differentCompanyId = new UniqueEntityID("company-2");
		const staffUserId = new UniqueEntityID("staff-1");
		const clientId = new UniqueEntityID("client-1");

		const appointment = makeAppointment({ companyId, clientId });
		const staff = makeStaff({
			userId: staffUserId,
			companyId: differentCompanyId,
		});

		mockAppointmentRepo.findById.mockResolvedValueOnce(appointment);
		mockStaffRepo.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: staffUserId.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAppointmentRepo.findById).toHaveBeenCalledWith(
			appointment.id.toString(),
		);
		expect(mockStaffRepo.findByUserId).toHaveBeenCalledWith(
			staffUserId.toString(),
		);
	});
});
