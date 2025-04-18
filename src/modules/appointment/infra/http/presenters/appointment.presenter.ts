import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { z } from "zod";
import { AppointmentDto } from "../dtos/appointment.dto";

export class AppointmentPresenter {
	protected schema = AppointmentDto;

	static toHTTP(entity: Appointment): z.infer<typeof AppointmentDto> {
		const base = {
			id: entity.id.toString(),
			animalId: entity.animalId.toString(),
			staffId: entity.staffId.toString(),
			clientId: entity.clientId.toString(),
			serviceId: entity.serviceId.toString(),
			companyId: entity.companyId.toString(),
			startDate: entity.startDate.toISOString(),
			endDate: entity.endDate.toISOString(),
			status: entity.status,
			price: entity.price,
			coatType: entity.coatType,
		};

		return AppointmentDto.parse(base);
	}
}
