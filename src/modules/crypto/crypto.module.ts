import { Module } from '@nestjs/common';
import { SiweService } from './services/siwe.service';

@Module({
  providers: [SiweService],
  exports: [SiweService],
})
export class CryptoModule {}
