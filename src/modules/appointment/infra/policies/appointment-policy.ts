import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Injectable } from "@nestjs/common";
import { AppointmentPolicy } from "../../domain/policies/appointment.policy";

@Injectable()
export class AppointmentPolicyImpl implements AppointmentPolicy {
	constructor(private readonly staffRepo: StaffRepository) {}

	async ensureCanCancel({
		user,
		appointment,
	}: Parameters<AppointmentPolicy["ensureCanCancel"]>[0]) {
		if (
			user.type === "CUSTOMER" &&
			appointment.clientId.toString() !== user.id
		) {
			return false;
		}

		const staff = await this.staffRepo.findById(user.id);
		if (!staff || staff.userId.toString() !== user.id) {
			return false;
		}

		return true;
	}
}
