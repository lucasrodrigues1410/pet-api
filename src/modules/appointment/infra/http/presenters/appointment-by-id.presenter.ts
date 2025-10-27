import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { Payment } from "@/modules/payment/domain/entities/payment.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { AppointmentPresenter } from "./appointment.presenter";

type AppointmentWithRelations = Appointment & {
	animal: Animal & { breed: Breed; asset?: Asset };
	client: User;
	service: Service;
	company: Company;
	payment: Payment | null;
};

export class AppointmentByIdPresenter {
	static present(appointment: AppointmentWithRelations) {
		return AppointmentPresenter.presentComplete(
			appointment,
			appointment.animal,
			appointment.client,
			appointment.service,
			appointment.company,
			appointment.payment,
		);
	}
}
