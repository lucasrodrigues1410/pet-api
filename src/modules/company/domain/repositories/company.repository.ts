import { Asset } from "@/modules/asset/domain/entities/asset";
import { CompanyAvailability } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { Company } from "../entities/company.entity";

export abstract class CompanyRepository {
	abstract findById(id: string): Promise<
		| (Company & {
				availabilities: CompanyAvailability[];
				images: Asset[];
		  })
		| null
	>;
}
