import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UnitOfWork } from "@/core/contracts/unit-of-work.interface";
import { PrismaUnitOfWork } from "./prisma-unit-of-work.service.ts";

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
