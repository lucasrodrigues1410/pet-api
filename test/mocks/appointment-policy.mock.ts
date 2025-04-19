import { Either, right, left } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { UserType } from "@/modules/user/domain/entities/user.entity";
import { AppointmentPolicy } from "@/modules/appointment/domain/policies/appointment.policy";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";

export class AppointmentPolicyMock extends AppointmentPolicy {
  constructor(private allowed = true) {
    super();
  }

  async ensureCanCancel(params: {
    user: { id: string; type: UserType };
    appointment: Appointment;
  }): Promise<Either<NotAllowedError, void>> {
    if (this.allowed) {
      return right(undefined);
    }
    return left(new NotAllowedError());
  }
}
