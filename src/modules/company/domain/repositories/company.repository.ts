import { Company } from "../entities/company.entity";

export abstract class CompanyRepository {
	abstract findById(id: number): Promise<Company | null>;
	abstract searchCompanies(params: {
		location?: {
			latitude: number;
			longitude: number;
		};
		query?: string;
		page?: number;
	}): Promise<Company[]>;
}
