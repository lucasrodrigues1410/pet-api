import { User } from "@/modules/user/domain/entities/user.entity";
import { UserPresenter } from "./user.presenter";

export class ClientWithAppointmentsPresenter {
	static present(
		client: User & {
			appointmentsCount: number;
			lastAppointmentDate: Date | null;
		},
	) {
		return {
			...UserPresenter.toHTTP(client),
			appointmentsCount: client.appointmentsCount,
			lastAppointmentDate: client.lastAppointmentDate?.toISOString() ?? null,
		};
	}
}
