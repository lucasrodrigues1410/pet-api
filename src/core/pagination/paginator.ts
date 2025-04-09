import { PaginationParams } from './pagination-params';
import { PaginationResult } from './pagination-result';

export async function paginate<T>(
  repoFn: (args: { skip: number; take: number }) => Promise<T[]>,
  countFn: () => Promise<number>,
  params: PaginationParams,
): Promise<PaginationResult<T>> {
  const skip = (params.page - 1) * params.limit;
  const take = params.limit;
  const [items, total] = await Promise.all([
    repoFn({ skip, take }),
    countFn(),
  ]);
  const totalPages = Math.ceil(total / params.limit);
  return { items, total, page: params.page, limit: params.limit, totalPages };
}