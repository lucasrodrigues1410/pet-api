import { PaginationMeta } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";

type Result<T> = {
	items: T[];
	meta: PaginationMeta;
};

export async function paginate<T>(
	repoFn: (args: { skip: number; take: number }) => Promise<T[]>,
	countFn: () => Promise<number>,
	params: PaginationQuery,
): Promise<Result<T>> {
	const page = params.page || 1;
	const limit = params.limit || 10;

	const skip = (page - 1) * limit;
	const take = limit;
	const [items, total] = await Promise.all([repoFn({ skip, take }), countFn()]);
	const totalPages = Math.ceil(total / limit);
	return { items, meta: { page, limit, total, totalPages } };
}
