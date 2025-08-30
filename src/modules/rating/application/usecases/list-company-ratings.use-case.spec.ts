import { beforeEach, describe, expect, it } from "bun:test";
import { makeRating } from "test/factories/make-rating";
import { makeUser } from "test/factories/make-user";
import { InMemoryRatingRepository } from "test/repositories/in-memory-rating.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { ListCompanyRatingsUseCase } from "./list-company-ratings.use-case";

let inMemoryRatingRepository: InMemoryRatingRepository;
let sut: ListCompanyRatingsUseCase;

describe("List Company Ratings", () => {
	beforeEach(() => {
		inMemoryRatingRepository = new InMemoryRatingRepository();
		sut = new ListCompanyRatingsUseCase(inMemoryRatingRepository);
	});

	it("should list company ratings with pagination", async () => {
		const companyId = new UniqueEntityID();
		const user1 = makeUser({ name: "Maria Silva" });
		const user2 = makeUser({ name: "Pedro Santos" });
		const user3 = makeUser({ name: "Ana Costa" });

		// Adiciona usuários ao repositório
		inMemoryRatingRepository.users.push(user1, user2, user3);

		// Cria ratings para a empresa
		const ratings = [
			makeRating({
				companyId,
				userId: user1.id,
				rating: 5,
				comment: "Excelente atendimento!",
				createdAt: new Date("2024-01-14"),
			}),
			makeRating({
				companyId,
				userId: user2.id,
				rating: 4,
				comment: "Bom serviço, meu cachorro ficou muito bem cuidado.",
				createdAt: new Date("2024-01-13"),
			}),
			makeRating({
				companyId,
				userId: user3.id,
				rating: 5,
				comment: "Profissionais muito competentes e carinhosos com os animais.",
				createdAt: new Date("2024-01-12"),
			}),
		];

		// Adiciona ratings de outra empresa para testar filtro
		const otherCompanyRating = makeRating({
			companyId: new UniqueEntityID(),
			rating: 3,
		});

		for (const rating of [...ratings, otherCompanyRating]) {
			inMemoryRatingRepository.items.push(rating);
		}

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
		inMemoryRatingRepository.users.push(user);

		// Cria 15 ratings
		const ratings = Array.from({ length: 15 }, (_, index) =>
			makeRating({
				companyId,
				userId: user.id,
				rating: 5,
				createdAt: new Date(2024, 0, index + 1), // Datas diferentes
			}),
		);

		for (const rating of ratings) {
			inMemoryRatingRepository.items.push(rating);
		}

		// Primeira página
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
		inMemoryRatingRepository.shouldThrowNotFound = true;

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
