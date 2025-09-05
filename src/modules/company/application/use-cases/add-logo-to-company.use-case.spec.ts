import { beforeEach, describe, expect, it } from "bun:test";
import { makeCompany } from "test/factories/make-company";
import { MockUploader } from "test/mocks/mock-uploader";
import { InMemoryAssetRepository } from "test/repositories/in-memory-asset.repository";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AddLogoToCompanyUseCase } from "./add-logo-to-company.use-case";

let inMemoryCompanyRepository: InMemoryCompanyRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;
let inMemoryUploader: MockUploader;
let uploadAndCreateAssetUseCase: UploadAndCreateAssetUseCase;
let sut: AddLogoToCompanyUseCase;

describe("Add logo to company", () => {
	beforeEach(() => {
		inMemoryCompanyRepository = new InMemoryCompanyRepository();
		inMemoryAssetRepository = new InMemoryAssetRepository();
		inMemoryUploader = new MockUploader();
		uploadAndCreateAssetUseCase = new UploadAndCreateAssetUseCase(
			inMemoryAssetRepository,
			inMemoryUploader,
		);
		sut = new AddLogoToCompanyUseCase(
			inMemoryCompanyRepository,
			uploadAndCreateAssetUseCase,
		);
	});

	it("should add logo to company", async () => {
		const company = makeCompany();
		inMemoryCompanyRepository.items.push(company);

		const mockFile = {
			originalname: "logo.jpg",
			mimetype: "image/jpeg",
			buffer: Buffer.from("fake-image-data"),
			size: 1024,
		} as Express.Multer.File;

		const result = await sut.execute({
			companyId: company.id.toString(),
			userId: "user-123",
			file: mockFile,
		});

		expect(result.isRight()).toBe(true);
	});

	it("should not add logo to non-existent company", async () => {
		const mockFile = {
			originalname: "logo.jpg",
			mimetype: "image/jpeg",
			buffer: Buffer.from("fake-image-data"),
			size: 1024,
		} as Express.Multer.File;

		const result = await sut.execute({
			companyId: "non-existent-company",
			userId: "user-123",
			file: mockFile,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
