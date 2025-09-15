import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { CompanyPresenter } from "@/modules/company/infra/http/presenters/company.presenter";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { ServicePresenter } from "@/modules/service/infra/http/presenters/service.presenter";
import { PaginationResult } from "@/shared/utils/pagination";
import { AppointmentPresenter } from "./appointment.presenter";

type AppointmentWithRelations = Appointment & {
	animal: Animal;
	service: Service;
	company: Company;
};

export class UserAppointmentsPresenter {
	static present(result: PaginationResult<AppointmentWithRelations>) {
		return {
			meta: result.meta,
			items: result.items.map((appointment) => ({
				...AppointmentPresenter.presentBasic(appointment),
				animal: {
					id: appointment.animal.id.toString(),
					userId: appointment.animal.userId.toString(),
					breedId: appointment.animal.breedId.toString(),
					name: appointment.animal.name,
					age: appointment.animal.age,
					weight: appointment.animal.weight,
					assetId: appointment.animal.assetId?.toString(),
					size: appointment.animal.size,
					ageStage: appointment.animal.ageStage,
				},
				service: ServicePresenter.present(appointment.service),
				company: CompanyPresenter.presentBasic(appointment.company),
			})),
		};
	}
}
