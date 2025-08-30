import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "prisma/generated/client";
import { LogOptions } from "prisma/generated/internal/class";
import { PrismaClientOptions } from "prisma/generated/internal/prismaNamespace";

@Injectable()
export class PrismaService
	extends PrismaClient<PrismaClientOptions, LogOptions<PrismaClientOptions>>
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		super({
			log: ["warn", "error"],
			datasources: {
				db: {
					url: process.env.DATABASE_URL,
				},
			},
		});
	}

	onModuleInit() {
		return this.$connect();
	}

	onModuleDestroy() {
		return this.$disconnect();
	}
}
