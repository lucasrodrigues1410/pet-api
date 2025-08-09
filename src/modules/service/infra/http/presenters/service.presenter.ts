import { z } from "zod";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { serviceDto } from "../dtos/service.dto";

export class ServicePresenter {
	static toHTTP(service: Service): z.infer<typeof serviceDto> {
		return {
			id: service.id.toString(),
			name: service.name,
			description: service.description || undefined,
			price: service.price,
			isActive: service.isActive,
			duration: service.duration || undefined,
			companyId: service.companyId.toString(),
			details: service.details || undefined,
			priceRange: {
				min: service.priceRange?.min || 0,
				max: service.priceRange?.max || 0,
			},
		};
	}
}
