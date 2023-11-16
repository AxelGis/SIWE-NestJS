import { Module } from '@nestjs/common';
import { SiweService } from './services/siwe.service';
import { HttpModule } from '@nestjs/axios';
import { CryptoController } from './crypto.controller';
import { OneInchService } from './services/1inch.service';

@Module({
  imports: [HttpModule],
  controllers: [CryptoController],
  providers: [SiweService, OneInchService],
  exports: [SiweService, OneInchService],
})
export class CryptoModule {}
