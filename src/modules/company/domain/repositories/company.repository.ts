import { Company } from "../entities/company.entity";

export abstract class CompanyRepository {
	abstract findById(id: number): Promise<Company | null>;
	abstract findAllOpenCompanies(): Promise<Company[]>;
}
