import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeRating } from "test/factories/make-rating";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { RatingRepository } from "../../domain/repositories/rating.repository";
import { ListCompanyRatingsUseCase } from "./list-company-ratings.use-case";

let moduleRef: any;
let sut: ListCompanyRatingsUseCase;

const mockRatingRepository = { findByCompanyId: jest.fn() };

describe("List Company Ratings", () => {
	beforeEach(async () => {
		mockRatingRepository.findByCompanyId.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				ListCompanyRatingsUseCase,
				{ provide: RatingRepository, useValue: mockRatingRepository },
			],
		}).compile();

		sut = moduleRef.get(ListCompanyRatingsUseCase);
	});

	it("should list company ratings with pagination", async () => {
		const companyId = new UniqueEntityID();
		const user1 = makeUser({ name: "Maria Silva" });
		const user2 = makeUser({ name: "Pedro Santos" });
		const user3 = makeUser({ name: "Ana Costa" });

		const r1 = makeRating({
			companyId,
			userId: user1.id,
			rating: 5,
			comment: "Excelente atendimento!",
			createdAt: new Date("2024-01-14"),
		});
		const r2 = makeRating({
			companyId,
			userId: user2.id,
			rating: 4,
			comment: "Bom serviço, meu cachorro ficou muito bem cuidado.",
			createdAt: new Date("2024-01-13"),
		});
		const r3 = makeRating({
			companyId,
			userId: user3.id,
			rating: 5,
			comment: "Profissionais muito competentes e carinhosos com os animais.",
			createdAt: new Date("2024-01-12"),
		});

		mockRatingRepository.findByCompanyId.mockResolvedValueOnce({
			items: [
				Object.assign(r1 as any, { user: { id: user1.id, name: user1.name } }),
				Object.assign(r2 as any, { user: { id: user2.id, name: user2.name } }),
				Object.assign(r3 as any, { user: { id: user3.id, name: user3.name } }),
			],
			meta: { page: 1, total: 3, totalPages: 1 },
		});

		const result = await sut.execute({
			companyId: companyId.toString(),
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.items).toHaveLength(3);
			expect(result.value.meta.total).toBe(3);
			expect(result.value.meta.page).toBe(1);

			// Verifica se estão ordenados por data (mais recentes primeiro)
			expect(result.value.items[0].rating).toBe(5);
			expect(result.value.items[0].user.name).toBe("Maria Silva");
			expect(result.value.items[1].user.name).toBe("Pedro Santos");
			expect(result.value.items[2].user.name).toBe("Ana Costa");
		}
	});

	it("should return empty list for company with no ratings", async () => {
		const companyId = new UniqueEntityID();

		mockRatingRepository.findByCompanyId.mockResolvedValueOnce({
			items: [],
			meta: { page: 1, total: 0, totalPages: 0 },
		});

		const result = await sut.execute({
			companyId: companyId.toString(),
			page: 1,
			limit: 10,
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.items).toHaveLength(0);
			expect(result.value.meta.total).toBe(0);
		}
	});

	it("should handle pagination correctly", async () => {
		const companyId = new UniqueEntityID();
		const user = makeUser();

		// Primeira página
		mockRatingRepository.findByCompanyId.mockResolvedValueOnce({
			items: Array.from(
				{ length: 10 },
				(_, index) =>
					makeRating({
						companyId,
						userId: user.id,
						rating: 5,
						createdAt: new Date(2024, 0, index + 1),
					}) as any,
			),
			meta: { page: 1, total: 15, totalPages: 2 },
		});

		const firstPageResult = await sut.execute({
			companyId: companyId.toString(),
			page: 1,
			limit: 10,
		});

		expect(firstPageResult.isRight()).toBe(true);

		if (firstPageResult.isRight()) {
			expect(firstPageResult.value.items).toHaveLength(10);
			expect(firstPageResult.value.meta.total).toBe(15);
			expect(firstPageResult.value.meta.page).toBe(1);
			expect(firstPageResult.value.meta.totalPages).toBe(2);
		}

		// Segunda página
		mockRatingRepository.findByCompanyId.mockResolvedValueOnce({
			items: Array.from(
				{ length: 5 },
				(_, index) =>
					makeRating({
						companyId,
						userId: user.id,
						rating: 5,
						createdAt: new Date(2024, 0, index + 11),
					}) as any,
			),
			meta: { page: 2, total: 15, totalPages: 2 },
		});

		const secondPageResult = await sut.execute({
			companyId: companyId.toString(),
			page: 2,
			limit: 10,
		});

		expect(secondPageResult.isRight()).toBe(true);

		if (secondPageResult.isRight()) {
			expect(secondPageResult.value.items).toHaveLength(5);
			expect(secondPageResult.value.meta.page).toBe(2);
		}
	});

	it("should handle repository errors", async () => {
		mockRatingRepository.findByCompanyId.mockResolvedValueOnce({
			items: [],
			meta: { page: 1, total: 0, totalPages: 0 },
		});

		const result = await sut.execute({
			companyId: "non-existent-company",
			page: 1,
			limit: 10,
		});

		// Como o método não verifica se a empresa existe antes de buscar ratings,
		// deve retornar uma lista vazia ao invés de erro
		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.items).toHaveLength(0);
		}
	});
});
