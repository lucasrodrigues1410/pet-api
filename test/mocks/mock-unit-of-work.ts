import { UnitOfWork } from "@/core/domain/interfaces/unit-of-work.interface";

export class MockUnitOfWork implements UnitOfWork {
	async transaction<T>(action: (tx: any) => Promise<T>): Promise<T> {
		return action({});
	}
}
