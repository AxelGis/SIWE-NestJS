import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class OneInchErrorMetaDto {
  @IsString()
  type: string;
  @IsString()
  value: string;
}

export class OneInchErrorDto {
  @IsNumber()
  statusCode: number;
  @IsString()
  error: string;
  @IsString()
  description: string;
  @IsString()
  requestId: string;
  @IsArray()
  meta: OneInchErrorMetaDto[];
}

export class OneInchChainIdDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  chainId: number;
}

export class OneInchAllowanceDto extends OneInchChainIdDto {
  @ApiProperty({
    example: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
  })
  @IsString()
  tokenAddress: string;

  @ApiPropertyOptional({
    example: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
  })
  @IsString()
  @IsOptional()
  walletAddress?: string;

  @ApiPropertyOptional({
    example: '10',
  })
  @IsNumberString()
  @IsOptional()
  amount?: string;
}

export class OneInchGetAllowanceDto {
  @IsString()
  allowance: string;
}

export class OneInchSwapReqDto extends OneInchChainIdDto {
  @ApiProperty({
    example: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  })
  @IsString()
  src: string;

  @ApiProperty({
    example: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
  })
  @IsString()
  dst: string;

  @ApiProperty({
    example: '100000000000000000',
  })
  @IsNumberString()
  amount: string;

  @ApiProperty({
    example: '0x0',
  })
  @IsString()
  from: string;

  @ApiProperty({
    example: '1',
  })
  @IsNumberString()
  slippage: string;
}

export class OneInchTxDto {
  @IsString()
  data: string;
  @IsString()
  gasPrice: string;
  @IsString()
  to: string;
  @IsString()
  value: string;
  @IsString()
  from?: string;
  @Transform((val) => BigInt(val.value))
  gas?: bigint;
}

export class OneInchSwapTxDto {
  @IsString()
  toAmount: string;
  @IsObject()
  tx: OneInchTxDto;
}
