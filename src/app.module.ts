import { Module } from '@nestjs/common';
import { PrismaModule } from './common/infrastructure/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/presentation/guards/auth.guard';

@Module({
  imports: [PrismaModule, AuthModule,UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
