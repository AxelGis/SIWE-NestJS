import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async checkHealth(): Promise<'OK'> {
    await this.prisma.checkHealth();
    return 'OK';
  }
}
