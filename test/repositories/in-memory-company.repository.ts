import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";

export class InMemoryCompanyRepository implements CompanyRepository {
	public items: Company[] = [];

	findById(id: string): Promise<Company | null> {
		return Promise.resolve(
			this.items.find((company) => company.id.toString() === id) || null,
		);
	}
	searchCompanies(params: {
		location?: { latitude: number; longitude: number };
		query?: string;
		page?: number;
	}): Promise<Company[]> {
		return Promise.resolve(
			this.items.filter((company) => company.name.includes(params.query || "")),
		);
	}

	async create(company: Company): Promise<void> {
		this.items.push(company);
		await Promise.resolve(company);
	}
}
