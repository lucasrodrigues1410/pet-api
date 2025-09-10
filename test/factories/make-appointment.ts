import { faker } from "@faker-js/faker";
import { add } from "date-fns";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	Appointment,
	CoatType,
} from "@/modules/appointment/domain/entities/appointment.entity";

export function makeAppointment(
	override: Partial<Appointment> = {},
	id?: UniqueEntityID,
) {
	const appointment = Appointment.create(
		{
			startDate: add(new Date(), { minutes: 1 }),
			endDate: add(new Date(), { hours: 1 }),
			status: "scheduled", // Always use SCHEDULED so it can be canceled
			price: faker.number.float({ min: 1, max: 100 }),
			serviceId: new UniqueEntityID(),
			clientId: new UniqueEntityID(),
			staffId: new UniqueEntityID(),
			coatType: faker.helpers.arrayElement<CoatType>([
				"short",
				"medium",
				"long",
				"curly",
			]),
			animalId: new UniqueEntityID(),
			companyId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return appointment;
}
