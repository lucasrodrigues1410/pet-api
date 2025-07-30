import { z } from "zod";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { companyDto } from "../dtos/company.dto";

export class CompanyPresenter {
	static toHTTP(user: Company): z.infer<typeof companyDto> {
		return {
			id: user.id.toString(),
			name: user.name,
			address: user.address,
			contact: user.contact,
		};
	}
}
