import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { GetAppointmentByIdUseCase } from "./get-appointment-by-id.use-case";
import { makeAppointment } from "test/factories/make-appointment";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";

describe("GetAppointmentByIdUseCase", () => {
	let inMemoryAppointmentRepository: InMemoryAppointmentRepository;
	let sut: GetAppointmentByIdUseCase;

	beforeEach(() => {
		inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
		sut = new GetAppointmentByIdUseCase(inMemoryAppointmentRepository);
	});

	it("should return an appointment if it exists", async () => {
		const appointment = makeAppointment();
		inMemoryAppointmentRepository.items.push(appointment);

		const result = await sut.execute({
			id: appointment.id.toString(),
			userId: appointment.clientId.toString(),
		});

		expect(result.isRight()).toBe(true);
	});

	it("should return ResourceNotFoundError if appointment does not exist", async () => {
		const result = await sut.execute({
			id: "non-existing-id",
			userId: "user-1",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
