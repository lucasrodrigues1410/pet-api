import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";

export class InMemoryCompanyRepository implements CompanyRepository {
	private companies: Company[] = [];

	findById(id: number): Promise<Company | null> {
		return Promise.resolve(
			this.companies.find((company) => company.id === id) || null,
		);
	}
	searchCompanies(params: {
		location?: { latitude: number; longitude: number };
		query?: string;
		page?: number;
	}): Promise<Company[]> {
		return Promise.resolve(
			this.companies.filter((company) =>
				company.name.includes(params.query || ""),
			),
		);
	}

	async create(company: Company): Promise<void> {
		this.companies.push(company);
		await Promise.resolve(company);
	}
}
