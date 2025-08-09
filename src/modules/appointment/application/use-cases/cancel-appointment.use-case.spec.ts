import { beforeEach, describe, expect, it } from "bun:test";
import { makeAppointment } from "test/factories/make-appointment";
import { AppointmentPolicyMock } from "test/mocks/appointment-policy.mock";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { AppointmentStatus } from "../../domain/enums/appointment.enum";
import { CancelAppointmentUseCase } from "./cancel-appointment.use-case";

describe("CancelAppointmentUseCase", () => {
	let appointmentRepository: InMemoryAppointmentRepository;
	let policyMock: AppointmentPolicyMock;

	let sut: CancelAppointmentUseCase;

	beforeEach(() => {
		appointmentRepository = new InMemoryAppointmentRepository();
		policyMock = new AppointmentPolicyMock(true);

		sut = new CancelAppointmentUseCase(appointmentRepository, policyMock);
	});

	it("should cancel an appointment", async () => {
		const appointment = makeAppointment();
		appointmentRepository.items.push(appointment);

		const result = await sut.execute({
			appointmentId: appointment.id.toString(),
			user: {
				id: appointment.clientId.toString(),
				type: "CUSTOMER",
			},
		});

		expect(result.isRight()).toBe(true);
		expect(appointment.status).toBe(AppointmentStatus.CANCELED);
	});

	it("should not cancel an appointment if the user is not in the policy", async () => {
		policyMock = new AppointmentPolicyMock(false);
		sut = new CancelAppointmentUseCase(appointmentRepository, policyMock);

		const appointment = makeAppointment();
		appointmentRepository.items.push(appointment);

		const result = await sut.execute({
			appointmentId: appointment.id.toString(),
			user: {
				id: "another-user-id",
				//@ts-expect-error
				type: "teste",
			},
		});
		expect(result.isLeft()).toBe(true);
	});
});
