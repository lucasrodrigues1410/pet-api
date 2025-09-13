import { User } from "@/modules/user/domain/entities/user.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { ClientWithAppointmentsPresenter } from "./client-with-appointments.presenter";

export class ClientListPresenter {
	static present(
		clients: PaginationResult<
			User & { appointmentsCount: number; lastAppointmentDate: Date | null }
		>,
	) {
		return {
			items: clients.items.map((client) =>
				ClientWithAppointmentsPresenter.present(client),
			),
			meta: clients.meta,
		};
	}
}
