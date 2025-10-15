import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "prisma/generated/client";
import { LogOptions } from "prisma/generated/internal/class";
import { PrismaClientOptions } from "prisma/generated/internal/prismaNamespace";
import { TransactionManager } from "@/core/domain/interfaces/transaction-manager";

@Injectable()
export class PrismaService
	extends PrismaClient<PrismaClientOptions, LogOptions<PrismaClientOptions>>
	implements OnModuleInit, OnModuleDestroy, TransactionManager
{
	constructor() {
		const adapter = new PrismaPg({
			connectionString: process.env.DATABASE_URL,
		});
		super({ log: ["warn", "error"], adapter });
	}

	onModuleInit() {
		return this.$connect();
	}

	onModuleDestroy() {
		return this.$disconnect();
	}

	async executeInTransaction<T>(
		callback: (tx: Prisma.TransactionClient) => Promise<T>,
	): Promise<T> {
		return this.$transaction(callback);
	}
}
