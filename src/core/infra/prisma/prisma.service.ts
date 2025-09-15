import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "prisma/generated/client";
import { LogOptions } from "prisma/generated/internal/class";
import { PrismaClientOptions } from "prisma/generated/internal/prismaNamespace";

@Injectable()
export class PrismaService
	extends PrismaClient<PrismaClientOptions, LogOptions<PrismaClientOptions>>
	implements OnModuleInit, OnModuleDestroy
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
}
