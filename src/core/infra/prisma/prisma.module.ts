import { UnitOfWork } from "@/core/contracts/unit-of-work.interface";
import { Global, Module } from "@nestjs/common";
import { PrismaUnitOfWork } from "./prisma-unit-of-work.service.ts";
import { PrismaService } from "./prisma.service";

@Global()
@Module({
	providers: [
		PrismaService,
		{
			provide: UnitOfWork,
			useClass: PrismaUnitOfWork,
		},
	],
	exports: [
		PrismaService,
		{
			provide: UnitOfWork,
			useClass: PrismaUnitOfWork,
		},
	],
})
export class PrismaModule {}
