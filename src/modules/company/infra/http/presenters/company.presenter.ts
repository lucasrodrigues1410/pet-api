import { Company } from "@/modules/company/domain/entities/company.entity";

export class CompanyPresenter {
	static toHTTP(company: Company) {
		return {
			id: company.id.toString(),
			name: company.name,
		};
	}
}
