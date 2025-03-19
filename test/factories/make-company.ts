import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import {
	Company,
	CompanyProps,
} from "src/modules/company/domain/entities/company.entity";
import { PrismaCompanyMapper } from "src/modules/company/infra/database/mappers/prisma-company.mapper";

export function makeCompany(override: Partial<Company> = {}, id?: number) {
	const student = Company.create(
		{
			name: faker.company.name(),
			address: faker.location.streetAddress(),
			contact: faker.phone.number(),
			...override,
		},
		id,
	);

	return student;
}

@Injectable()
export class CompanyFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaCompany(data: Partial<CompanyProps> = {}): Promise<Company> {
		const company = makeCompany(data);

		await this.prisma.company.create({
			data: PrismaCompanyMapper.toPrisma(company),
		});

		return company;
	}
}
