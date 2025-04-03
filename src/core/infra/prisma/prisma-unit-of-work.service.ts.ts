import { UnitOfWork } from "@/core/contracts/unit-of-work.interface";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
	constructor(private readonly prismaService: PrismaService) {}

	async transaction<T>(
		action: (tx: PrismaService | typeof this.prismaService) => Promise<T>,
	): Promise<T> {
		return this.prismaService.$transaction(async (tx) => {
			return await action(tx as PrismaService);
		});
	}
}
