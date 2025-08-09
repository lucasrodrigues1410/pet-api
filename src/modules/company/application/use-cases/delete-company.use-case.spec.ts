import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { makeCompany } from "test/factories/make-company";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { DeleteCompanyUseCase } from "./delete-company.use-case";

let inMemoryCompanyRepository: InMemoryCompanyRepository;
let sut: DeleteCompanyUseCase;

describe("DeleteCompanyUseCase", () => {
  beforeEach(() => {
    inMemoryCompanyRepository = new InMemoryCompanyRepository();
    sut = new DeleteCompanyUseCase(inMemoryCompanyRepository);
  });

  it("should soft delete company when user is owner", async () => {
    const company = makeCompany();
    await inMemoryCompanyRepository.create(company, faker.string.uuid());

    const result = await sut.execute({
      companyId: company.id.toString(),
    });

    expect(result.isRight()).toBeTruthy();
    const found = await inMemoryCompanyRepository.findById(company.id.toString());
    expect(found).toBeNull();
  });
});


