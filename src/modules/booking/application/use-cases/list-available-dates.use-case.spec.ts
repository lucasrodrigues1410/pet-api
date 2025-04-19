import { beforeEach, describe, expect, it, test } from "bun:test";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DaysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { Staff } from "@/modules/staff/domain/entities/staff.entity";
import { Either } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { getDay, set } from "date-fns";
import { makeAppointment } from "test/factories/make-appointment";
import { makeCompanyAvailability } from "test/factories/make-company-availability";
import { makeService } from "test/factories/make-service";
import { makeStaff } from "test/factories/make-staff";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { InMemoryCompanyAvailabilityExceptionRepository } from "test/repositories/in-memory-company-availability-exception.repository";
import { InMemoryCompanyAvailabilityRepository } from "test/repositories/in-memory-company-availability.repository";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff.repository";
import { ListAvailableDatesUseCase } from "./list-available-dates.use-case";

function expectResultIsRight<L, R>(
	result: Either<L, R>,
): asserts result is Either<never, R> {
	expect(result.isRight()).toBe(true);
}

function expectResultIsLeft<L, R>(
	result: Either<L, R>,
): asserts result is Either<L, never> {
	expect(result.isLeft()).toBe(true);
}

describe("ListAvailableDatesUseCase", () => {
	let inMemoryAppointmentRepository: InMemoryAppointmentRepository;
	let inMemoryCompanyAvailabilityRepository: InMemoryCompanyAvailabilityRepository;
	let inMemoryCompanyAvailabilityExceptionRepository: InMemoryCompanyAvailabilityExceptionRepository;
	let inMemoryServiceRepository: InMemoryServiceRepository;
	let inMemoryStaffRepository: InMemoryStaffRepository;
	let sut: ListAvailableDatesUseCase;

	let companyId: UniqueEntityID;
	let staff: Staff;
	let service: Service;
	let defaultDate: Date;

	beforeEach(() => {
		inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
		inMemoryCompanyAvailabilityRepository =
			new InMemoryCompanyAvailabilityRepository();
		inMemoryCompanyAvailabilityExceptionRepository =
			new InMemoryCompanyAvailabilityExceptionRepository();
		inMemoryServiceRepository = new InMemoryServiceRepository();
		inMemoryStaffRepository = new InMemoryStaffRepository();

		sut = new ListAvailableDatesUseCase(
			inMemoryCompanyAvailabilityRepository,
			inMemoryCompanyAvailabilityExceptionRepository,
			inMemoryServiceRepository,
			inMemoryStaffRepository,
		);

		companyId = new UniqueEntityID();
		staff = makeStaff({ companyId });
		service = makeService({ companyId, duration: 30 });
		defaultDate = set(new Date(), {
			hours: 8,
			minutes: 0,
			seconds: 0,
			milliseconds: 0,
		});

		inMemoryStaffRepository.items.push(staff);
		inMemoryServiceRepository.items.push(service);
	});

	it("should return available slots when company is open and no conflicts exist", async () => {
		const dayOfWeek = Object.values(DaysOfWeek)[getDay(defaultDate)];
		const companyAvailability = makeCompanyAvailability({
			companyId: companyId,
			day: dayOfWeek,
			startTime: "08:00",
			endTime: "17:00",
		});
		inMemoryCompanyAvailabilityRepository.items.push(companyAvailability);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: defaultDate,
		});

		expectResultIsRight(result);
		if (result.isRight()) {
			expect(result.value.slots.length).toBeGreaterThan(0);
		}
	});

	it("should return ResourceNotFoundError when company availability for the day is not found", async () => {
		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: defaultDate,
		});

		expectResultIsLeft(result);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should return ResourceNotFoundError when the service is not found", async () => {
		const nonExistentServiceId = "non-existent-service-id";
		const dayOfWeek = Object.values(DaysOfWeek)[getDay(defaultDate)];
		const companyAvailability = makeCompanyAvailability({
			// Adiciona disponibilidade para isolar o erro no serviço
			companyId: companyId,
			day: dayOfWeek,
			startTime: "08:00",
			endTime: "17:00",
		});
		inMemoryCompanyAvailabilityRepository.items.push(companyAvailability);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: nonExistentServiceId,
			date: defaultDate,
		});

		expectResultIsLeft(result);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should return no slots when the requested date/time is outside company operating hours for that day", async () => {
		const dayOfWeek = Object.values(DaysOfWeek)[getDay(defaultDate)];
		const companyAvailability = makeCompanyAvailability({
			companyId: companyId,
			day: dayOfWeek,
			startTime: "09:00",
			endTime: "17:00",
		});
		inMemoryCompanyAvailabilityRepository.items.push(companyAvailability);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: defaultDate,
		});

		expectResultIsRight(result);
		expect(result.value.slots.length).toBe(0);
	});

	it("should exclude time slots occupied by existing appointments for any staff", async () => {
		const appointmentTime = set(defaultDate, { hours: 9, minutes: 0 });
		const appointmentEndTime = set(defaultDate, { hours: 9, minutes: 30 });
		const appointment = makeAppointment({
			serviceId: service.id,
			staffId: staff.id,
			startDate: appointmentTime,
			endDate: appointmentEndTime,
		});

		inMemoryStaffRepository.items[0].appointments = [appointment];
		inMemoryAppointmentRepository.items.push(appointment);

		const dayOfWeek = Object.values(DaysOfWeek)[getDay(defaultDate)];
		const companyAvailability = makeCompanyAvailability({
			companyId: companyId,
			day: dayOfWeek,
			startTime: "08:00",
			endTime: "17:00",
		});
		inMemoryCompanyAvailabilityRepository.items.push(companyAvailability);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: defaultDate,
		});

		expectResultIsRight(result);
		const availableSlots = result.value.slots;
		expect(availableSlots.length).toBeGreaterThan(0);
		console.log(inMemoryStaffRepository.items[0].appointments);
		expect(availableSlots.some((slot) => slot.label === "09:00")).toBe(false);
		expect(availableSlots.some((slot) => slot.label === "09:30")).toBe(true);
	});

	it("should return an error (Left) when the provided date is invalid", async () => {
		const invalidDate = new Date("invalid-date-string");

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: invalidDate,
		});

		expectResultIsLeft(result);
	});
});
