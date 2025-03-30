import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { CalculateUnavailableSlotsUseCase } from "./calculate-unavailable-slots.use-case";
import { addDays } from "date-fns";
import { makeAppointment } from "test/factories/make-appointment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryAppointmentRepository: InMemoryAppointmentRepository;

let sut: CalculateUnavailableSlotsUseCase;

describe("CalculateUnavailableSlotsUseCase", () => {
	beforeEach(() => {
		inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
		sut = new CalculateUnavailableSlotsUseCase(inMemoryAppointmentRepository);
	});

	it("should be able to calculate unavailable slots", async () => {
		const companyId = new UniqueEntityID().toString();
		const startDate = new Date();
		const endDate = addDays(startDate, 1);
		const appointments = Array.from({ length: 2 }, () =>
			makeAppointment({ companyId, startDate, endDate }),
		);
		inMemoryAppointmentRepository.items = appointments;

		const unavailableSlots = await sut.execute(companyId, startDate, endDate);

		expect(unavailableSlots.value?.slots).toHaveLength(1);
	});

	it("should be able to calculate unavailable slots with different dates", async () => {
		const companyId = new UniqueEntityID().toString();
		const startDate = new Date();
		const endDate = addDays(startDate, 1);
		const appointments = [
            makeAppointment({ companyId, startDate, endDate }),
            makeAppointment({ companyId, startDate: addDays(startDate, 1), endDate }),
        ];
		inMemoryAppointmentRepository.items = appointments;

		const unavailableSlots = await sut.execute(companyId, startDate, endDate);

		expect(unavailableSlots.value?.slots).toHaveLength(2);
	});
});
