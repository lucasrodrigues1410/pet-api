import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { CheckRatingEligibilityUseCase } from "./check-rating-eligibility.use-case";

describe("Check rating eligibility", () => {
	let sut: CheckRatingEligibilityUseCase;

	const mockRatingRepository = {
		findByUserAndCompany: jest.fn(),
	};

	const mockAppointmentRepository = {
		userHasCompletedAppointmentForCompany: jest.fn(),
	};

	beforeEach(async () => {
		mockRatingRepository.findByUserAndCompany.mockReset();
		mockAppointmentRepository.userHasCompletedAppointmentForCompany.mockReset();

		const moduleRef = await Test.createTestingModule({
			providers: [
				CheckRatingEligibilityUseCase,
				{ provide: RatingRepository, useValue: mockRatingRepository },
				{ provide: AppointmentRepository, useValue: mockAppointmentRepository },
			],
		}).compile();

		sut = moduleRef.get(CheckRatingEligibilityUseCase);
	});

	it("should allow rating when user has completed appointment and no previous rating", async () => {
		mockRatingRepository.findByUserAndCompany.mockResolvedValueOnce(null);
		mockAppointmentRepository.userHasCompletedAppointmentForCompany.mockResolvedValueOnce(true);

		const result = await sut.execute({
			userId: "user-1",
			companyId: "company-1",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value).toEqual({ canRate: true });
		}
	});

	it("should deny rating when user already rated the company", async () => {
		mockRatingRepository.findByUserAndCompany.mockResolvedValueOnce({ id: "rating-1" });

		const result = await sut.execute({
			userId: "user-1",
			companyId: "company-1",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value).toEqual({
				canRate: false,
				reason: "ALREADY_RATED",
			});
		}
	});

	it("should deny rating when user has no completed appointment", async () => {
		mockRatingRepository.findByUserAndCompany.mockResolvedValueOnce(null);
		mockAppointmentRepository.userHasCompletedAppointmentForCompany.mockResolvedValueOnce(false);

		const result = await sut.execute({
			userId: "user-1",
			companyId: "company-1",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value).toEqual({
				canRate: false,
				reason: "NO_COMPLETED_APPOINTMENT",
			});
		}
	});
});
