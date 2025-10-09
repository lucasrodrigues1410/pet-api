import { Injectable } from "@nestjs/common";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { Either, right } from "@/shared/either";

interface CheckRatingEligibilityUseCaseRequest {
	userId: string;
	companyId: string;
}

type RatingEligibilityReason = "ALREADY_RATED" | "NO_COMPLETED_APPOINTMENT";

type CheckRatingEligibilityUseCaseResponse = Either<
	never,
	{
		canRate: boolean;
		reason?: RatingEligibilityReason;
	}
>;

@Injectable()
export class CheckRatingEligibilityUseCase {
	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly appointmentRepository: AppointmentRepository,
	) {}

	async execute(
		params: CheckRatingEligibilityUseCaseRequest,
	): Promise<CheckRatingEligibilityUseCaseResponse> {
		const existingRating =
			await this.ratingRepository.findByUserAndCompany(params);

		if (existingRating) {
			return right({ canRate: false, reason: "ALREADY_RATED" });
		}

		const hasCompletedAppointment =
			await this.appointmentRepository.userHasCompletedAppointmentForCompany(
				params,
			);

		if (!hasCompletedAppointment) {
			return right({ canRate: false, reason: "NO_COMPLETED_APPOINTMENT" });
		}

		return right({ canRate: true });
	}
}
