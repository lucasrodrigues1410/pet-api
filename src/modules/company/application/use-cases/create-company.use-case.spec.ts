import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { CreateCompanyUseCase } from "./create-company.use-case";

let inMemoryCompanyRepository: InMemoryCompanyRepository;
let sut: CreateCompanyUseCase;

describe("CreateCompanyUseCase", () => {
	beforeEach(() => {
		inMemoryCompanyRepository = new InMemoryCompanyRepository();
		sut = new CreateCompanyUseCase(inMemoryCompanyRepository);
	});

	it("should create a company and set owner as ADMIN", async () => {
		const ownerUserId = faker.string.uuid();
		const result = await sut.execute({
			ownerUserId,
			name: faker.company.name(),
			address: faker.location.streetAddress(),
			contact: faker.phone.number(),
		});

		expect(result.isRight()).toBeTruthy();
		const created = result.isRight() && result.value.company;
		expect(created).toBeTruthy();
		const isOwner = await inMemoryCompanyRepository.isOwner({
			companyId: created!.id.toString(),
			userId: ownerUserId,
		});
		expect(isOwner).toBeTruthy();
	});
});
