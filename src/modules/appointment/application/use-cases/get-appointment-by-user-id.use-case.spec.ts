import { beforeEach, describe, expect, it } from "bun:test";
import { makeAppointment } from "test/factories/make-appointment";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { GetAppointmentByUserIdUseCase } from "./get-appointment-by-user-id.use-case";

describe("GetAppointmentByUserIdUseCase", () => {
	let inMemoryAppointmentRepository: InMemoryAppointmentRepository;
	let sut: GetAppointmentByUserIdUseCase;

	beforeEach(() => {
		inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
		sut = new GetAppointmentByUserIdUseCase(inMemoryAppointmentRepository);
	});

	it("should be able to get an appointment by user id", async () => {
		const userId = new UniqueEntityID();
		inMemoryAppointmentRepository.items = [
			makeAppointment({ clientId: userId }),
			makeAppointment({ clientId: userId }),
			makeAppointment({ clientId: userId }),
		];

		const result = await sut.execute({
			userId: userId.toString(),
			query: {
				page: 1,
				limit: 10,
			},
		});

		const items = result.value?.items;

		expect(items).toHaveLength(3);
		expect((items ?? [])[0].clientId.toString()).toEqual(userId.toString());
	});

	it("should not be able to get an appointment by user id if user id is invalid", async () => {
		const userId = new UniqueEntityID();
		inMemoryAppointmentRepository.items = [
			makeAppointment({ clientId: userId }),
			makeAppointment({ clientId: userId }),
			makeAppointment({ clientId: userId }),
		];

		const result = await sut.execute({
			userId: "invalid-user-id",
			query: {
				page: 1,
				limit: 10,
			},
		});

		expect(result.value?.items).toHaveLength(0);
	});
});
