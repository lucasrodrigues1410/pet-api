import { beforeEach, describe, expect, it, jest } from "bun:test";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { addDays } from "date-fns";
import { TimeSlotUnavailableError } from "@/modules/booking/application/errors/time-slot-unavailable.error";
import { AppointmentBookingUseCase } from "@/modules/booking/application/use-cases/appointment-booking.use-case";
import { ListAvailableDatesUseCase } from "@/modules/booking/application/use-cases/list-available-dates.use-case";
import { TimeSlot } from "@/modules/booking/domain/entities/time-slot.entity";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { BookingController } from "./booking.controller";

describe("Booking Controller", () => {
	let moduleRef: any;
	let sut: BookingController;

	const mockListAvailableDatesUseCase = { execute: jest.fn() };

	const mockAppointmentBookingUseCase = { execute: jest.fn() };

	beforeEach(async () => {
		mockListAvailableDatesUseCase.execute.mockReset();
		mockAppointmentBookingUseCase.execute.mockReset();

		moduleRef = await Test.createTestingModule({
			controllers: [BookingController],
			providers: [
				{
					provide: ListAvailableDatesUseCase,
					useValue: mockListAvailableDatesUseCase,
				},
				{
					provide: AppointmentBookingUseCase,
					useValue: mockAppointmentBookingUseCase,
				},
			],
		}).compile();

		sut = moduleRef.get(BookingController);
	});

	describe("listAvailableDates", () => {
		it("should return available dates successfully", async () => {
			const companyId = "company-id";
			const serviceId = "service-id";
			const date = addDays(new Date(), 1);
			const dateString = date.toISOString();

			const mockTimeSlots = [
				TimeSlot.create({ label: "09:00" }),
				TimeSlot.create({ label: "10:00" }),
				TimeSlot.create({ label: "11:00" }),
			];

			mockListAvailableDatesUseCase.execute.mockResolvedValueOnce({
				isRight: () => true,
				isLeft: () => false,
				value: { slots: mockTimeSlots },
			});

			const result = await sut.listAvailableDates({
				companyId,
				serviceId,
				date: dateString,
			});

			expect(result).toEqual({
				slots: [{ label: "09:00" }, { label: "10:00" }, { label: "11:00" }],
			});
			expect(mockListAvailableDatesUseCase.execute).toHaveBeenCalledWith({
				companyId,
				serviceId,
				date: expect.any(Date),
			});
		});

		it("should throw NotFoundException when use case returns error", async () => {
			const companyId = "company-id";
			const serviceId = "service-id";
			const date = addDays(new Date(), 1);
			const dateString = date.toISOString();

			mockListAvailableDatesUseCase.execute.mockResolvedValueOnce({
				isRight: () => false,
				isLeft: () => true,
				value: new ResourceNotFoundError(),
			});

			await expect(
				sut.listAvailableDates({ companyId, serviceId, date: dateString }),
			).rejects.toThrow(NotFoundException);
		});

		it("should handle empty slots", async () => {
			const companyId = "company-id";
			const serviceId = "service-id";
			const date = addDays(new Date(), 1);
			const dateString = date.toISOString();

			mockListAvailableDatesUseCase.execute.mockResolvedValueOnce({
				isRight: () => true,
				isLeft: () => false,
				value: { slots: [] },
			});

			const result = await sut.listAvailableDates({
				companyId,
				serviceId,
				date: dateString,
			});

			expect(result).toEqual({ slots: [] });
		});

		it("should handle slots with undefined labels", async () => {
			const companyId = "company-id";
			const serviceId = "service-id";
			const date = addDays(new Date(), 1);
			const dateString = date.toISOString();

			const mockTimeSlots = [
				TimeSlot.create({ label: undefined }),
				TimeSlot.create({ label: "10:00" }),
			];

			mockListAvailableDatesUseCase.execute.mockResolvedValueOnce({
				isRight: () => true,
				isLeft: () => false,
				value: { slots: mockTimeSlots },
			});

			const result = await sut.listAvailableDates({
				companyId,
				serviceId,
				date: dateString,
			});

			expect(result).toEqual({ slots: [{ label: "" }, { label: "10:00" }] });
		});
	});

	describe("createAppointment", () => {
		it("should create appointment successfully", async () => {
			const userId = "user-id";
			const serviceId = "service-id";
			const animalId = "animal-id";
			const date = addDays(new Date(), 1);
			const coatType = "short";

			mockAppointmentBookingUseCase.execute.mockResolvedValueOnce({
				isRight: () => true,
				isLeft: () => false,
				value: { appointmentId: "appointment-id-123" },
			});

			const result = await sut.createAppointment(userId, {
				serviceId,
				animalId,
				date: date.toISOString(),
				coatType,
			});

			expect(result).toEqual({ appointmentId: "appointment-id-123" });
			expect(mockAppointmentBookingUseCase.execute).toHaveBeenCalledWith({
				serviceId,
				animalId,
				clientId: userId,
				date: expect.any(Date),
				coatType,
			});
		});

		it("should throw BadRequestException when resource not found", async () => {
			const userId = "user-id";
			const serviceId = "service-id";
			const animalId = "animal-id";
			const date = addDays(new Date(), 1);
			const coatType = "short";

			mockAppointmentBookingUseCase.execute.mockResolvedValueOnce({
				isRight: () => false,
				isLeft: () => true,
				value: new ResourceNotFoundError(),
			});

			await expect(
				sut.createAppointment(userId, {
					serviceId,
					animalId,
					date: date.toISOString(),
					coatType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		it("should throw BadRequestException when time slot unavailable", async () => {
			const userId = "user-id";
			const serviceId = "service-id";
			const animalId = "animal-id";
			const date = addDays(new Date(), 1);
			const coatType = "short";

			mockAppointmentBookingUseCase.execute.mockResolvedValueOnce({
				isRight: () => false,
				isLeft: () => true,
				value: new TimeSlotUnavailableError("Horário indisponível"),
			});

			await expect(
				sut.createAppointment(userId, {
					serviceId,
					animalId,
					date: date.toISOString(),
					coatType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		it("should throw BadRequestException for any other error", async () => {
			const userId = "user-id";
			const serviceId = "service-id";
			const animalId = "animal-id";
			const date = addDays(new Date(), 1);
			const coatType = "short";

			const customError = new Error("Custom error message");

			mockAppointmentBookingUseCase.execute.mockResolvedValueOnce({
				isRight: () => false,
				isLeft: () => true,
				value: customError,
			});

			await expect(
				sut.createAppointment(userId, {
					serviceId,
					animalId,
					date: date.toISOString(),
					coatType,
				}),
			).rejects.toThrow(BadRequestException);
		});

		it("should handle different coat types", async () => {
			const userId = "user-id";
			const serviceId = "service-id";
			const animalId = "animal-id";
			const date = addDays(new Date(), 1);

			const coatTypes = ["short", "medium", "long", "curly"] as const;

			for (const coatType of coatTypes) {
				mockAppointmentBookingUseCase.execute.mockResolvedValueOnce({
					isRight: () => true,
					isLeft: () => false,
					value: { appointmentId: `appointment-id-${coatType}` },
				});

				const result = await sut.createAppointment(userId, {
					serviceId,
					animalId,
					date: date.toISOString(),
					coatType,
				});

				expect(result).toEqual({ appointmentId: `appointment-id-${coatType}` });
			}
		});

		it("should parse date correctly", async () => {
			const userId = "user-id";
			const serviceId = "service-id";
			const animalId = "animal-id";
			const date = new Date("2024-01-15T10:00:00.000Z");
			const coatType = "short";

			mockAppointmentBookingUseCase.execute.mockResolvedValueOnce({
				isRight: () => true,
				isLeft: () => false,
				value: { appointmentId: "appointment-id-123" },
			});

			await sut.createAppointment(userId, {
				serviceId,
				animalId,
				date: date.toISOString(),
				coatType,
			});

			expect(mockAppointmentBookingUseCase.execute).toHaveBeenCalledWith({
				serviceId,
				animalId,
				clientId: userId,
				date: expect.any(Date),
				coatType,
			});
		});
	});
});
