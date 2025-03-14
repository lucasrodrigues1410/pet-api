import { Company } from "../entities/company.entity";

export abstract class CompanyRepository {
	abstract findAllOpenCompanies(): Promise<Company[]>;
}
