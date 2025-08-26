import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import type { DateRange } from "@/shared/types/date-range";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Appointment } from "../entities/appointment.entity";

export abstract class AppointmentRepository {
	abstract findById(id: string): Promise<
		| (Appointment & {
				animal: Animal & { breed: Breed };
				client: User;
				service: Service;
				company: Company;
		  })
		| null
	>;
	abstract findByUserId(params: {
		userId: string;
		query: PaginationQuery;
	}): Promise<PaginationResult<Appointment & {
			animal: Animal;
			service: Service;
		}
	>>;
	abstract findByCompanyId(params: {
		companyId: string;
		query: PaginationQuery & {
			startDate?: Date | null;
			endDate?: Date | null;
		};
	}): Promise<
		PaginationResult<
			Appointment & {
				animal: Animal & { breed: Breed };
				client: User;
				service: Service;
			}
		>
	>;
	abstract create(appointment: Appointment): Promise<void>;
	abstract getByPeriod(params: {
		serviceId: string;
		range: DateRange;
	}): Promise<Appointment[]>;
	abstract update(appointment: Appointment): Promise<void>;
}
