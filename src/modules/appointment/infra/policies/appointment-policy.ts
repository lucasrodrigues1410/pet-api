import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { Injectable } from "@nestjs/common";
import { AppointmentPolicy } from "../../domain/policies/appointment.policy";

@Injectable()
export class AppointmentPolicyImpl implements AppointmentPolicy {
	constructor(private readonly staffRepo: StaffRepository) {}

	async ensureCanCancel({
		user,
		appointment,
	}: Parameters<AppointmentPolicy["ensureCanCancel"]>[0]): Promise<
		Either<NotAllowedError, void>
	> {
		if (
			user.type === "CUSTOMER" &&
			appointment.clientId.toString() !== user.id
		) {
			return left(new NotAllowedError());
		}

		const staff = await this.staffRepo.findById(user.id);
		if (!staff || staff.userId.toString() !== user.id) {
			return left(new NotAllowedError());
		}

		return right(undefined);
	}
}
