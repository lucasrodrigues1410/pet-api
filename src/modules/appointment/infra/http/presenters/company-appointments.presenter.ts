import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { AppointmentPresenter } from "./appointment.presenter";

type AppointmentWithRelations = Appointment & {
	animal: Animal & { breed: Breed };
	client: User;
	service: Service;
};

export class CompanyAppointmentsPresenter {
	static present(result: PaginationResult<AppointmentWithRelations>) {
		return {
			meta: result.meta,
			items: result.items.map((appointment) =>
				AppointmentPresenter.presentComplete(
					appointment,
					appointment.animal,
					appointment.client,
					appointment.service,
					appointment as any,
				),
			),
		};
	}
}
