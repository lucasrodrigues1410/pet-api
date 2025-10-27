import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { Payment } from "@/modules/payment/domain/entities/payment.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import type { DateRange } from "@/shared/types/date-range";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import { Appointment, AppointmentStatus } from "../entities/appointment.entity";

export abstract class AppointmentRepository {
	abstract findById(
		id: string,
	): Promise<
		| (Appointment & {
				animal: Animal & { breed: Breed; asset?: Asset };
				client: User;
				service: Service;
				company: Company;
				payment: Payment | null;
		  })
		| null
	>;
	abstract findByUserId(params: {
		userId: string;
		query: PaginationQuery & {
			startDate?: Date;
			endDate?: Date;
			status?: AppointmentStatus[];
		};
	}): Promise<
		PaginationResult<
			Appointment & { animal: Animal; service: Service; company: Company }
		>
	>;
	abstract findByCompanyId(params: {
		companyId: string;
		query: PaginationQuery & {
			startDate?: Date;
			endDate?: Date;
			status?: AppointmentStatus[];
			query?: string;
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
	abstract create(appointment: Appointment, tx?: any): Promise<void>;
	abstract getByPeriod(params: {
		serviceId: string;
		range: DateRange;
	}): Promise<Appointment[]>;
	abstract updateStatus(id: string, status: AppointmentStatus): Promise<void>;
	abstract getByPeriodAndCompanyId(params: {
		companyId: string;
		range: DateRange;
	}): Promise<Appointment[]>;
	abstract userHasCompletedAppointmentForCompany(params: {
		userId: string;
		companyId: string;
	}): Promise<boolean>;
}
