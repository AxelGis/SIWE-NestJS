import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OneInchService } from './services/1inch.service';
import { Public } from '../auth/decorators/public.decorator';
import {
  OneInchAllowanceDto,
  OneInchGetAllowanceDto,
  OneInchSwapReqDto,
  OneInchSwapTxDto,
  OneInchTxDto,
} from './dto/1inch.dto';
import Decimal from 'decimal.js';

@Controller('crypto')
@ApiTags('crypto')
export class CryptoController {
  constructor(private readonly oneInchService: OneInchService) {}

  @Public()
  @ApiBearerAuth('JWT-auth')
  @Post('1inch/getTokenAllowance')
  getTokenAllowance(
    @Body() { chainId, tokenAddress, walletAddress }: OneInchAllowanceDto,
  ): Promise<OneInchGetAllowanceDto> {
    return this.oneInchService.getTokenAllowance(
      chainId,
      tokenAddress,
      walletAddress,
    );
  }

  @Public()
  @ApiBearerAuth('JWT-auth')
  @Post('1inch/setTokenAllowance')
  setTokenAllowance(
    @Body() { chainId, tokenAddress, amount }: OneInchAllowanceDto,
  ): Promise<OneInchTxDto> {
    return this.oneInchService.setTokenAllowance(
      chainId,
      tokenAddress,
      new Decimal(amount),
    );
  }

  @Public()
  @ApiBearerAuth('JWT-auth')
  @Post('1inch/swap')
  swap(
    @Body() { chainId, src, dst, from, amount, slippage }: OneInchSwapReqDto,
  ): Promise<OneInchSwapTxDto> {
    return this.oneInchService.swap(
      chainId,
      src,
      dst,
      from,
      new Decimal(amount),
      new Decimal(slippage),
    );
  }
}
