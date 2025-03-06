import { Module } from "@nestjs/common";
import { ServiceController } from "./presentation/controllers/service.controller";
import { ListActiveServicesUseCase } from "./application/use-cases/list-active-services.use-case";
import { ServiceRepository } from "./domain/repositories/service.repository";
import { ServicePrismaRepository } from "./infrastructure/database/prisma/repositories/service.repository";

@Module({
    controllers: [ServiceController],
    providers: [
        ListActiveServicesUseCase,
        {
            provide: ServiceRepository,
            useClass: ServicePrismaRepository,
        },
    ],
})
export class ServiceModule {}
