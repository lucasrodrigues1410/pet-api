import { Global, Module } from "@nestjs/common";
import { TransactionManager } from "@/core/domain/interfaces/transaction-manager";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
	providers: [
		PrismaService,
		{ provide: TransactionManager, useExisting: PrismaService },
	],
	exports: [PrismaService],
})
export class PrismaModule {}
