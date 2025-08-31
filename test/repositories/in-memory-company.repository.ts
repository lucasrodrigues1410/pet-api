import { Company } from "src/modules/company/domain/entities/company.entity";
import { CompanyRepository } from "src/modules/company/domain/repositories/company.repository";

export class InMemoryCompanyRepository implements CompanyRepository {
	public items: Company[] = [];

	async findById(id: string) {
		const company = this.items.find((c) => c.id.toString() === id);
		if (!company) return null;

		return Object.assign(company, {
			availabilities: [],
			images: [],
		});
	}
}
