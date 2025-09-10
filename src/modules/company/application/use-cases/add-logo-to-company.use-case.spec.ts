import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeCompany } from "test/factories/make-company";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { AddLogoToCompanyUseCase } from "./add-logo-to-company.use-case";

let moduleRef: any;
let sut: AddLogoToCompanyUseCase;
const mockCompanyRepository = { findById: jest.fn(), update: jest.fn() };
const mockUploadAndCreateAssetUseCase = { execute: jest.fn() };

describe("Add logo to company", () => {
	beforeEach(async () => {
		mockCompanyRepository.findById.mockReset();
		mockCompanyRepository.update.mockReset();
		mockUploadAndCreateAssetUseCase.execute.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				AddLogoToCompanyUseCase,
				{ provide: CompanyRepository, useValue: mockCompanyRepository },
				{
					provide: UploadAndCreateAssetUseCase,
					useValue: mockUploadAndCreateAssetUseCase,
				},
			],
		}).compile();

		sut = moduleRef.get(AddLogoToCompanyUseCase);
	});

	it("should add logo to company", async () => {
		const company = makeCompany();
		mockCompanyRepository.findById.mockResolvedValueOnce(company as any);
		mockUploadAndCreateAssetUseCase.execute.mockResolvedValueOnce({
			isLeft: () => false,
			isRight: () => true,
			value: { asset: { id: "asset-id-123" } },
		});

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
		expect(mockCompanyRepository.update).toHaveBeenCalledWith(
			company.id.toString(),
			{ logoAssetId: "asset-id-123" },
		);
	});

	it("should not add logo to non-existent company", async () => {
		mockCompanyRepository.findById.mockResolvedValueOnce(null);
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
		expect(mockCompanyRepository.update).not.toHaveBeenCalled();
	});
});
