import { Module } from '@nestjs/common';
import { PrismaModule } from './common/infrastructure/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/presentation/guards/auth.guard';
import { AnimalModule } from './modules/animal/animal.module';

@Module({
  imports: [PrismaModule, AuthModule,UserModule,AnimalModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
