import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthConfig } from './auth.config';
import { CryptoModule } from '../crypto/crypto.module';
import { CookieModule } from '../cookies/cookie.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (authConfig: AuthConfig) => ({
        secret: authConfig.JWT_SECRET,
        signOptions: { expiresIn: authConfig.JWT_LIFETIME },
      }),
      inject: [AuthConfig],
    }),
    PrismaModule,
    CryptoModule,
    CookieModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
