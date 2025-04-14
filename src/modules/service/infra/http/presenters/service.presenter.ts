import { Service } from "@/modules/service/domain/entities/service.entity";

type Input = Service & {
	pricesRange?: number[];
};

export class ServicePresenter {
	static toHTTP(params: Input) {
		const base: Record<string, unknown> = {
			id: params.id.toString(),
			name: params.name,
			description: params.description || null,
			price: params.price,
		};

		if (params.pricesRange) {
			base.pricesRange = params.pricesRange;
		}

		if (params.company) {
			base.company = {
				id: params.company.id.toString(),
				name: params.company.name,
			};
		}

		if (params.categories) {
			base.categories = params.categories.map((category) => ({
				id: category.id.toString(),
				name: category.name,
				type: category.type,
			}));
		}

		return base;
	}
}
