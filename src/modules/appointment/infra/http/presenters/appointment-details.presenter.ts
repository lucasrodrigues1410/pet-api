import { z } from "zod";
import { AppointmentWithDetails } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentPresenter } from "./appointment.presenter";
import { AppointmentDetailsDto } from "../dtos/appointment-details.dto";
import { AnimalPresenter } from "@/modules/animal/infra/http/presenters/animal.presenter";
import { UserPresenter } from "@/modules/user/infra/http/presenters/user.presenter";
import { ServicePresenter } from "@/modules/service/infra/http/presenters/service.presenter";
import { CompanyPresenter } from "@/modules/company/infra/http/presenters/company.presenter";

export class AppointmentDetailsPresenter {
	static toHTTP(
		entity: AppointmentWithDetails,
	): z.infer<typeof AppointmentDetailsDto> {
		const base = AppointmentPresenter.toHTTP(entity);
		return {
			...base,
			animal: AnimalPresenter.toHTTP(entity.animal),
			client: UserPresenter.toHTTP(entity.client),
			service: ServicePresenter.toHTTP(entity.service),
			company: CompanyPresenter.toHTTP(entity.company),
		};
	}
}
