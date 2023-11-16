import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RulesController } from './rules.controller';

@Module({
  imports: [PrismaModule],
  providers: [RulesService],
  controllers: [RulesController],
  exports: [RulesService],
})
export class RulesModule {}
