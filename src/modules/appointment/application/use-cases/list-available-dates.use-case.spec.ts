import { beforeEach, describe, expect, it } from "bun:test";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { CompanyAvailabilityException } from "@/modules/company-availability/domain/entities/company-availability-exception.entity";
import { DaysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { TimeRange } from "@/modules/company-availability/domain/entities/value-objects/time-range";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { addDays, getDay, set } from "date-fns";
import { makeAppointment } from "test/factories/make-appointment";
import { makeCompanyAvailability } from "test/factories/make-company-availability";
import { makeService } from "test/factories/make-service";
import {
	InMemoryAppointmentIntentRepository,
	InMemoryAppointmentRepository,
} from "test/repositories/in-memory-appointment.repository";
import { InMemoryCompanyAvailabilityExceptionRepository } from "test/repositories/in-memory-company-availability-exception.repository";
import { InMemoryCompanyAvailabilityRepository } from "test/repositories/in-memory-company-availability.repository";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { ListAvailableDatesUseCase } from "./list-available-dates.use-case";

let inMemoryAppointmentRepository: InMemoryAppointmentRepository;
let inMemoryAppointmentIntentRepository: InMemoryAppointmentIntentRepository;
let inMemoryCompanyAvailability: InMemoryCompanyAvailabilityRepository;
let inMemoryCompanyAvailabilityException: InMemoryCompanyAvailabilityExceptionRepository;
let inMemoryServiceRepository: InMemoryServiceRepository;

let sut: ListAvailableDatesUseCase;

describe("ListAvailableDatesUseCase", () => {
	beforeEach(() => {
		inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
		inMemoryCompanyAvailability = new InMemoryCompanyAvailabilityRepository();
		inMemoryCompanyAvailabilityException =
			new InMemoryCompanyAvailabilityExceptionRepository();
		inMemoryServiceRepository = new InMemoryServiceRepository();
		inMemoryAppointmentIntentRepository =
			new InMemoryAppointmentIntentRepository();

		sut = new ListAvailableDatesUseCase(
			inMemoryAppointmentRepository,
			inMemoryCompanyAvailability,
			inMemoryCompanyAvailabilityException,
			inMemoryServiceRepository,
			inMemoryAppointmentIntentRepository,
		);
	});

	// 1. Caso Normal: Slots disponíveis sem conflitos
	it("should return available slots when no appointments or exceptions conflict", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, duration: 30 });
		const startDate = set(new Date(), { hours: 8, minutes: 0, seconds: 0 });

		inMemoryServiceRepository.items.push(service);
		const availableDate = makeCompanyAvailability({
			companyId: companyId,
			day: Object.values(DaysOfWeek)[getDay(startDate)],
			startTime: "08:00",
			endTime: "17:00",
		});

		inMemoryCompanyAvailability.items.push(availableDate);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: startDate,
		});

		expect(result.isRight()).toBeTruthy();
		if (result.isRight()) {
			expect(result.value.slots.length).toBeGreaterThan(0);
		}
	});

	// 2. Caso de Erro: Disponibilidade da empresa não encontrada
	it("should return ResourceNotFoundError when company availability is not found", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, duration: 30 });
		const startDate = set(new Date(), { hours: 8, minutes: 0, seconds: 0 });

		inMemoryServiceRepository.items.push(service);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: startDate,
		});

		expect(result.isLeft()).toBeTruthy();
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		}
	});

	// 3. Caso de Erro: Serviço não encontrado
	it("should return ResourceNotFoundError when service is not found", async () => {
		const companyId = new UniqueEntityID();
		const startDate = set(new Date(), { hours: 8, minutes: 0, seconds: 0 });

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: "non-existent-service-id",
			date: startDate,
		});

		expect(result.isLeft()).toBeTruthy();
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		}
	});

	// 4. Caso de Borda: Data fora do horário de funcionamento
	it("should return no slots when date is outside company availability", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, duration: 30 });
		const startDate = set(new Date(), { hours: 8, minutes: 0, seconds: 0 });
		const outsideDate = set(startDate, {
			hours: 19,
			minutes: 0,
			seconds: 0,
		});

		inMemoryServiceRepository.items.push(service);
		const availableDate = makeCompanyAvailability({
			companyId: companyId,
			day: Object.values(DaysOfWeek)[getDay(outsideDate)],
			startTime: "08:00",
			endTime: "17:00",
		});

		inMemoryCompanyAvailability.items.push(availableDate);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: outsideDate,
		});

		expect(result.isRight()).toBeTruthy();
		if (result.isRight()) {
			expect(result.value.slots.length).toBe(0);
		}
	});

	// 5. Caso de Agendamento Existente: Excluir slots com agendamentos
	it("should exclude slots with existing appointments", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, duration: 20 });
		const startDate = set(new Date(), { hours: 8, minutes: 0, seconds: 0 });

		inMemoryServiceRepository.items.push(service);
		const availableDate = makeCompanyAvailability({
			companyId: companyId,
			day: Object.values(DaysOfWeek)[getDay(startDate)],
			startTime: "08:00",
			endTime: "17:00",
		});

		inMemoryCompanyAvailability.items.push(availableDate);

		const appointment = makeAppointment({
			serviceId: service.id,
			startDate: set(startDate, { hours: 8, minutes: 0, seconds: 0 }),
			endDate: set(startDate, { hours: 8, minutes: 20, seconds: 0 }),
		});

		inMemoryAppointmentRepository.items.push(appointment);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: startDate,
		});

		expect(result.isRight()).toBeTruthy();
		if (result.isRight()) {
			const availableSlots = result.value.slots;
			expect(availableSlots.some((slot) => slot.label === "08:00")).toBeFalsy();
		}
	});

	// 6. Caso de Exceção de Disponibilidade: Excluir slots com exceções
	it("should exclude slots with availability exceptions", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, duration: 30 });
		const startDate = set(new Date(), { hours: 8, minutes: 0, seconds: 0 });

		inMemoryServiceRepository.items.push(service);
		const availableDate = makeCompanyAvailability({
			companyId: companyId,
			day: Object.values(DaysOfWeek)[getDay(startDate)],
			startTime: "08:00",
			endTime: "17:00",
		});

		inMemoryCompanyAvailability.items.push(availableDate);

		const exception = CompanyAvailabilityException.create({
			companyId: companyId.toString(),
			startDate: set(startDate, { hours: 9, minutes: 0, seconds: 0 }),
			endDate: set(startDate, { hours: 10, minutes: 0, seconds: 0 }),
		});

		inMemoryCompanyAvailabilityException.items.push(exception);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: startDate,
		});

		expect(result.isRight()).toBeTruthy();
		if (result.isRight()) {
			const availableSlots = result.value.slots;
			expect(availableSlots.some((slot) => slot.label === "09:00")).toBeFalsy();
		}
	});

	// 7. Caso de Duração do Serviço: Duração zero
	it("should handle zero duration service", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, duration: 0 });
		const startDate = set(new Date(), { hours: 8, minutes: 0, seconds: 0 });

		inMemoryServiceRepository.items.push(service);
		const availableDate = makeCompanyAvailability({
			companyId: companyId,
			day: Object.values(DaysOfWeek)[getDay(startDate)],
			startTime: "08:00",
			endTime: "17:00",
		});

		inMemoryCompanyAvailability.items.push(availableDate);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: startDate,
		});

		expect(result.isLeft()).toBeTruthy();
	});

	// 8. Caso de Data Inválida
	it("should handle invalid date", async () => {
		const companyId = new UniqueEntityID();
		const service = makeService({ companyId, duration: 30 });
		const invalidDate = new Date("invalid-date");

		inMemoryServiceRepository.items.push(service);

		const result = await sut.execute({
			companyId: companyId.toString(),
			serviceId: service.id.toString(),
			date: invalidDate,
		});

		expect(result.isLeft()).toBeTruthy();
	});
});
