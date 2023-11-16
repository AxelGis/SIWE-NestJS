import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveRuleDto {
  @IsNumber()
  @ApiProperty({ example: 0 })
  ruleId: number;

  @IsString()
  @ApiProperty({ example: 'name' })
  name: string;

  @IsString()
  @ApiProperty({ example: 'description' })
  description: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  version?: number | null;
}

export class SaveRuleCodeDto {
  @IsString()
  @ApiProperty({ example: 'code' })
  code: string;
}
