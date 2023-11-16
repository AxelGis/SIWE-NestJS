import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaConfig } from './prisma.config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: PrismaConfig) {
    super({
      datasources: {
        db: {
          url: config.MYSQL_DB_URL,
        },
      },
    });
  }

  async checkHealth() {
    await this.$queryRawUnsafe('SELECT 1');
  }

  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Exclude fields
   * @param type
   * @param omit
   * @returns
   */
  prismaExclude<T extends Entity, K extends Keys<T>>(type: T, omit: K[]) {
    type Key = Exclude<Keys<T>, K>;
    type TMap = Record<Key, true>;
    const result: TMap = {} as TMap;
    for (const key in Prisma[`${type}ScalarFieldEnum`]) {
      if (!omit.includes(key as K)) {
        result[key as Key] = true;
      }
    }
    return result;
  }
}

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;
