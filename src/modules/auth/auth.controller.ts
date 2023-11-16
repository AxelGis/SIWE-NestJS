import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import {
  AuthGetNonceDto,
  AuthPersonalSignDto,
  AuthSignInDto,
  AuthorizedFastifyRequest,
} from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { CookieService } from '../cookies/cookie.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signIn')
  async signIn(
    @Body() { address, siwe_message, sign, nonce }: AuthPersonalSignDto,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    await this.authService.validateNonce(address, nonce);

    const auth: AuthSignInDto = await this.authService.signIn(
      address,
      siwe_message,
      sign,
      nonce,
    );
    this.cookieService.setAccessTokenCookie(response, auth.access_token);

    return auth;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('signOut')
  async signOut(@Res({ passthrough: true }) response: FastifyReply) {
    this.cookieService.deleteAccessTokenCookie(response);
    return 'SignedOut';
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('getNonce')
  async getNonce(@Query() { address }: AuthGetNonceDto): Promise<string> {
    const nonce: string = await this.authService.getNonce(address);
    return nonce;
  }

  @ApiBearerAuth('JWT-auth')
  @Get('profile')
  getProfile(@Request() req: AuthorizedFastifyRequest) {
    return req.user;
  }
}
