import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { FastifyRequest } from 'fastify';

export type AuthorizedFastifyRequest = FastifyRequest & {
  user?: AuthPayloadDto;
};

export class AuthPayloadDto {
  @IsNumber()
  userId: number;
  @IsString()
  address: string;
}

export class AuthGetNonceDto {
  @IsString()
  @ApiProperty({ example: '0x0' })
  address: string;
}

export class AuthPersonalSignDto extends AuthGetNonceDto {
  @IsString()
  @ApiProperty({ example: 'mysign' })
  sign: string;

  @IsString()
  @ApiProperty({ example: 'nonce' })
  nonce: string;

  @IsString()
  @ApiProperty({ example: 'message' })
  siwe_message: string;
}

export class AuthSignInDto {
  @IsString()
  access_token: string;
  @IsString()
  token_type: string;
}

export class AuthJWTDto extends AuthPayloadDto {
  @IsNumber()
  iat: number;
  @IsNumber()
  exp: number;
}
