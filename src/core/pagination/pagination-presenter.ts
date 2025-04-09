import { PaginationResult } from "./pagination-result";

export class PaginationResultPresenter {
    static toHTTP<T>(result: PaginationResult<T>): PaginationResult<T> {
        return {
            items: result.items,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
}