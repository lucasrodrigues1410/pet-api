import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { CancelAppointmentUseCase } from "./cancel-appointment.use-case";
import { makeAppointment } from "test/factories/make-appointment";
import { AppointmentStatus } from "../../domain/enums/appointment.enum";
import { AppointmentPolicyMock } from "test/mocks/appointment-policy.mock";

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

    it("should not cancel an appointment if the user is not the client", async () => {
        const appointment = makeAppointment();
        appointmentRepository.items.push(appointment);

        const result = await sut.execute({
            appointmentId: appointment.id.toString(),
            user: {
                id: "another-user-id",
                type: "COMPANY",
            },
        });

        expect(result.isLeft()).toBe(true);
        expect(appointment.status).not.toBe(AppointmentStatus.CANCELED);
    });
});
