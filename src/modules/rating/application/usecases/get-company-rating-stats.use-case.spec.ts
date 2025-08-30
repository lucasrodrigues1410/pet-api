import { beforeEach, describe, expect, it } from "bun:test";
import { makeRating } from "test/factories/make-rating";
import { InMemoryRatingRepository } from "test/repositories/in-memory-rating.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { GetCompanyRatingStatsUseCase } from "./get-company-rating-stats.use-case";

let inMemoryRatingRepository: InMemoryRatingRepository;
let sut: GetCompanyRatingStatsUseCase;

describe("Get Company Rating Stats", () => {
	beforeEach(() => {
		inMemoryRatingRepository = new InMemoryRatingRepository();
		sut = new GetCompanyRatingStatsUseCase(inMemoryRatingRepository);
	});

	it("should get company rating statistics", async () => {
		const companyId = new UniqueEntityID();

		// Cria ratings com diferentes valores
		const ratings = [
			makeRating({ companyId, rating: 5 }), // 5 estrelas
			makeRating({ companyId, rating: 5 }), // 5 estrelas
			makeRating({ companyId, rating: 5 }), // 5 estrelas
			makeRating({ companyId, rating: 4 }), // 4 estrelas
			makeRating({ companyId, rating: 4 }), // 4 estrelas
			makeRating({ companyId, rating: 3 }), // 3 estrelas
		];

		for (const rating of ratings) {
			inMemoryRatingRepository.items.push(rating);
		}

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(6);
			expect(stats.averageRating).toBeCloseTo(4.33, 2); // (5+5+5+4+4+3)/6 = 4.33

			expect(stats.distribution).toEqual([
				{ rating: 5, count: 3 },
				{ rating: 4, count: 2 },
				{ rating: 3, count: 1 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should return zero stats for company with no ratings", async () => {
		const companyId = new UniqueEntityID();

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(0);
			expect(stats.averageRating).toBe(0);
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 0 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should calculate correct stats for all 5-star ratings", async () => {
		const companyId = new UniqueEntityID();

		// Todas as avaliações são 5 estrelas
		const ratings = Array.from({ length: 10 }, () =>
			makeRating({ companyId, rating: 5 }),
		);

		for (const rating of ratings) {
			inMemoryRatingRepository.items.push(rating);
		}

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(10);
			expect(stats.averageRating).toBe(5);
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 10 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should calculate correct stats for mixed ratings", async () => {
		const companyId = new UniqueEntityID();

		// Mix de avaliações como no exemplo da imagem
		const ratings = [
			makeRating({ companyId, rating: 5 }),
			makeRating({ companyId, rating: 5 }),
			makeRating({ companyId, rating: 5 }),
			makeRating({ companyId, rating: 4 }),
			makeRating({ companyId, rating: 4 }),
			makeRating({ companyId, rating: 3 }),
		];

		for (const rating of ratings) {
			inMemoryRatingRepository.items.push(rating);
		}

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(6);
			expect(stats.averageRating).toBeCloseTo(4.3, 1);
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 3 },
				{ rating: 4, count: 2 },
				{ rating: 3, count: 1 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should only count ratings for the specified company", async () => {
		const companyId = new UniqueEntityID();
		const otherCompanyId = new UniqueEntityID();

		// Ratings para a empresa alvo
		const targetCompanyRatings = [
			makeRating({ companyId, rating: 5 }),
			makeRating({ companyId, rating: 4 }),
		];

		// Ratings para outra empresa (não devem ser contados)
		const otherCompanyRatings = [
			makeRating({ companyId: otherCompanyId, rating: 1 }),
			makeRating({ companyId: otherCompanyId, rating: 2 }),
			makeRating({ companyId: otherCompanyId, rating: 3 }),
		];

		for (const rating of [...targetCompanyRatings, ...otherCompanyRatings]) {
			inMemoryRatingRepository.items.push(rating);
		}

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(2);
			expect(stats.averageRating).toBe(4.5); // (5+4)/2
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 1 },
				{ rating: 4, count: 1 },
				{ rating: 3, count: 0 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});

	it("should handle single rating correctly", async () => {
		const companyId = new UniqueEntityID();

		const rating = makeRating({ companyId, rating: 3 });
		inMemoryRatingRepository.items.push(rating);

		const result = await sut.execute({
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const stats = result.value;

			expect(stats.totalRatings).toBe(1);
			expect(stats.averageRating).toBe(3);
			expect(stats.distribution).toEqual([
				{ rating: 5, count: 0 },
				{ rating: 4, count: 0 },
				{ rating: 3, count: 1 },
				{ rating: 2, count: 0 },
				{ rating: 1, count: 0 },
			]);
		}
	});
});
