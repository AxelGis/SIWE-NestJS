import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import hashEquals from 'hash-equals';
import { UsersService } from '../users/users.service';
import { AuthPayloadDto, AuthSignInDto } from './dto/auth.dto';
import { AppConfig } from '../app/app.config';
import { PrismaService } from '../prisma/prisma.service';
import { generateNonce, SiweMessage } from 'siwe';
import { SiweService } from '../crypto/services/siwe.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private siweService: SiweService,
    private jwtService: JwtService,
    private appConfig: AppConfig,
  ) {}

  /**
   * Return JWT
   * @param address
   * @param sign
   * @returns
   */
  async signIn(
    address: string,
    message: string,
    sign: string,
    nonce: string,
  ): Promise<AuthSignInDto> {
    const siweMessage: SiweMessage = await this.siweService.checkSign(
      message,
      sign,
      nonce,
    );
    if (!this.validateSiweMessage(siweMessage, address)) {
      throw new UnauthorizedException();
    }

    //обновляем nonce в базе
    await this.generateNonce(address);

    //создаем пользоавтеля или получаем из базы
    const user: User = await this.usersService.findUserOrCreate(address);

    //получаем access_token
    const payload: AuthPayloadDto = { userId: user.id, address: user.address };

    const access_token: string = await this.jwtService.signAsync(payload);

    return {
      access_token,
      token_type: 'Bearer',
    };
  }

  /**
   * Get nonce for address
   * @param address
   * @returns
   */
  async getNonce(address: string): Promise<string> {
    return (
      (await this.getNonceByAddress(address)) ??
      (await this.generateNonce(address))
    );
  }

  /**
   * Generate nonce and save to DB
   * @param address
   * @returns
   */
  async generateNonce(address: string): Promise<string> {
    const nonce = generateNonce();

    await this.prisma.authNonce.upsert({
      where: {
        address,
      },
      create: {
        address,
        nonce,
      },
      update: {
        nonce,
      },
    });

    return nonce;
  }

  /**
   * Get nonce from DB
   * @param address
   * @returns
   */
  async getNonceByAddress(address: string): Promise<string | null> {
    const authNonce = await this.prisma.authNonce.findFirst({
      where: {
        address,
      },
      select: {
        nonce: true,
      },
    });

    return authNonce?.nonce;
  }

  /**
   * Validate nonce
   * @param address
   * @param nonce
   */
  async validateNonce(address: string, nonce: string) {
    const { nonce: dbNonce } = await this.prisma.authNonce.findFirstOrThrow({
      select: {
        nonce: true,
      },
      where: {
        address,
      },
    });

    if (!hashEquals(dbNonce, nonce)) {
      throw new BadRequestException(`Nonce validation failed!`);
    }
  }

  /**
   * Validate siwe-message params
   * @param siweMessage
   * @param address
   */
  validateSiweMessage(siweMessage: SiweMessage, address: string): boolean {
    //сообщение подписано с другого адреса
    if (siweMessage.address !== address) {
      return false;
    }

    const url: URL = new URL(this.appConfig.FRONTEND_URL);
    const appDomain = `${url.hostname}${url.port !== '' ? ':' + url.port : ''}`;

    const uri: URL = new URL(siweMessage.uri);
    const uriDomain = `${uri.hostname}${uri.port !== '' ? ':' + uri.port : ''}`;

    //домен не прошел проверку
    if (siweMessage.domain !== appDomain || uriDomain !== appDomain) {
      return false;
    }

    return true;
  }
}
