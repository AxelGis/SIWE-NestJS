import { WalletsBalanceHistoryModule } from './../wallets-balance-history/wallets-balance-history.module';
import { TransactionsHistoryModule } from './../transactions-history/transactions-history.module';
import * as path from 'node:path';

import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { checkNodeEnv, useConfigs } from '../../etc';
import { AuthConfig } from '../auth/auth.config';
import { PrismaConfig } from '../prisma/prisma.config';
import { PrismaModule } from '../prisma/prisma.module';
import { AppConfig } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../auth/auth.guard';
import { CryptoModule } from '../crypto/crypto.module';
import { CookieModule } from '../cookies/cookie.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { RulesModule } from '../rules/rules.module';

const { isProduction, isTesting, isDev } = checkNodeEnv();

const envFilePaths: string[] = [path.resolve(process.cwd(), './.env')];

if (isTesting) {
  envFilePaths.push(path.resolve(process.cwd(), './.ops/.env/.env.e2e'));
} else if (isDev) {
  envFilePaths.push(path.resolve(process.cwd(), './.ops/.env/.env.dev'));
}

if (!isProduction) {
  // we prefer to not use .env files in production
  envFilePaths.push(path.resolve(process.cwd(), './.ops/.env/.env.secrets'));
}

@Module({
  imports: [
    ...useConfigs([AppConfig, PrismaConfig, AuthConfig], envFilePaths),
    PrismaModule,
    ScheduleModule.forRoot(),
    AuthModule,
    CookieModule,
    CryptoModule,
    RulesModule,
    SubscriptionsModule,
    TransactionsHistoryModule,
    UsersModule,
    WalletsBalanceHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [PrismaModule],
})
export class AppModule implements OnApplicationShutdown {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes({ path: '*', method: RequestMethod.ALL });
  }
  onApplicationShutdown(signal?: string): any {
    if (signal) {
      console.info(`Received shut down signal ${signal}`);
    } else {
      console.info(`Application shut down`);
    }
  }
}
