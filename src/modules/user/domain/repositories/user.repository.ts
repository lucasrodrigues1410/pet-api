import { Asset } from "@/modules/asset/domain/entities/asset";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import { User } from "../entities/user.entity";

export abstract class UserRepository {
	abstract findByEmail(
		email: string,
	): Promise<(User & { avatar?: Asset }) | null>;
	abstract findById(id: string): Promise<User | null>;
	abstract create(user: User): Promise<void>;
	abstract update(id: string, user: Partial<User>): Promise<void>;
	abstract findClientsByCompanyId(params: {
		companyId: string;
		query: PaginationQuery & { search?: string };
	}): Promise<
		PaginationResult<
			User & { appointmentsCount: number; lastAppointmentDate: Date | null }
		>
	>;
}
