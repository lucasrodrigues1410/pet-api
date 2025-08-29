import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Appointment, AppointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { DateRange } from "@/shared/types/date-range";
import { PaginationResult } from "@/shared/utils/pagination";
import { paginate } from "@/shared/utils/paginator";
import { makeAnimal } from "../factories/make-animal";
import { makeCompany } from "../factories/make-company";
import { makeService } from "../factories/make-service";
import { makeUser } from "../factories/make-user";

export class InMemoryAppointmentRepository implements AppointmentRepository {
	public items: Appointment[] = [];

	async findById(id: string) {
		const result = this.items.find(
			(appointment) => appointment.id.toString() === id,
		);
		if (!result) return null;

		const appointmentWithRelations = Object.assign(result, {
			animal: makeAnimal({ id: result.animalId }),
			client: makeUser({ id: result.clientId }),
			service: makeService({ id: result.serviceId }),
			company: makeCompany({ id: result.companyId }),
		});

		return appointmentWithRelations as Appointment & {
			animal: Animal & { breed: Breed };
			client: User;
			service: Service;
			company: Company;
		};
	}

	async findByUserId(
		params: Parameters<AppointmentRepository["findByUserId"]>[0],
	) {
		const result = await paginate(
			async ({ skip, take }) => {
				const filtered = this.items.filter((appointment) => {
					return appointment.clientId.toString() === params.userId;
				});
				return filtered.slice(skip, skip + take);
			},
			async () =>
				this.items.filter((item) => item.clientId.toString() === params.userId)
					.length,
			params.query,
		);

		return result as PaginationResult<
			Appointment & { animal: Animal; service: Service }
		>;
	}

	async findByCompanyId(
		params: Parameters<AppointmentRepository["findByCompanyId"]>[0],
	) {
		const result = await paginate(
			async ({ skip, take }) => {
				const filtered = this.items.filter((appointment) => {
					return appointment.companyId.toString() === params.companyId;
				});
				return filtered.slice(skip, skip + take);
			},
			async () =>
				this.items.filter(
					(item) => item.companyId.toString() === params.companyId,
				).length,
			params.query,
		);

		return result as PaginationResult<
			Appointment & {
				animal: Animal & { breed: Breed };
				client: User;
				service: Service;
			}
		>;
	}

	async create(appointment: Appointment) {
		this.items.push(appointment);
	}

	async getByPeriod(params: { serviceId: string; range: DateRange }) {
		const { serviceId, range } = params;
		return this.items.filter((appointment) => {
			return (
				appointment.serviceId.toString() === serviceId &&
				appointment.startDate >= range.startDate &&
				appointment.endDate <= range.endDate
			);
		});
	}

	async updateStatus(id: string, status: AppointmentStatus) {
		const index = this.items.findIndex((item) => item.id.toString() === id);
		if (index !== -1) {
			this.items[index].status = status;
		}
	}
}
