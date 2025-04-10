import { PaginationParams } from "./pagination-params";
import { PaginationResult } from "./pagination-result";

export async function paginate<T>(
	repoFn: (args: { skip: number; take: number }) => Promise<T[]>,
	countFn: () => Promise<number>,
	params: PaginationParams,
): Promise<PaginationResult<T>> {
	const page = params.page || 1;
	const limit = params.limit || 10;

	const skip = (page - 1) * limit;
	const take = limit;
	const [items, total] = await Promise.all([repoFn({ skip, take }), countFn()]);
	const totalPages = Math.ceil(total / limit);
	return { items, total, page, limit, totalPages };
}
