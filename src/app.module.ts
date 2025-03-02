import { Module } from '@nestjs/common';
import { PrismaModule } from './common/infrastructure/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth-clean/auth.module';

@Module({
  imports: [PrismaModule, AuthModule,UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
