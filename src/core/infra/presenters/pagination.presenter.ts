import { PaginationMeta, PaginationMetaDto } from "@/shared/utils/pagination";

type Params<T> = {
	items: T[];
	meta: PaginationMeta;
};

export class PaginationPresenter {
	static toHTTP<T>(result: Params<T>): Params<T> {
		const base = {
			items: result.items,
			meta: {
				total: result.meta.total,
				page: result.meta.page,
				limit: result.meta.limit,
				totalPages: result.meta.totalPages,
			},
		};
		PaginationMetaDto.parse(base.meta);
		return base;
	}
}
