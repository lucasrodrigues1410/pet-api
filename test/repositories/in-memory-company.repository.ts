import { paginate } from "@/shared/utils/paginator";
import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";

export class InMemoryCompanyRepository implements CompanyRepository {
	public items: Company[] = [];

	findById(id: string): Promise<Company | null> {
		return Promise.resolve(
			this.items.find((company) => company.id.toString() === id) || null,
		);
	}
	searchCompanies(params: Parameters<CompanyRepository["searchCompanies"]>[0]) {
		return paginate(
			async () =>
				this.items.filter((company) =>
					company.name.includes(params.query || ""),
				),
			async () => this.items.length,
			params,
		);
	}

	async create(company: Company): Promise<void> {
		this.items.push(company);
		await Promise.resolve(company);
	}
}
