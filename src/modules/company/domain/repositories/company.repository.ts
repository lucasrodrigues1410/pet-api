import { Company } from "../entities/company.entity";

export abstract class CompanyRepository {
	abstract findById(id: string): Promise<Company | null>;
	abstract searchCompanies(params: {
		location?: {
			latitude: number;
			longitude: number;
		};
		query?: string;
		page?: number;
	}): Promise<Company[]>;
	abstract create(company: Company): Promise<void>;
}
