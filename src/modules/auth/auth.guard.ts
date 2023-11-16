import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from './auth.config';
import { FastifyRequest } from 'fastify';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { AuthJWTDto, AuthorizedFastifyRequest } from './dto/auth.dto';
import { COOKIE_ACCESS_TOKEN } from '../cookies/cookie.constants';
import { checkNodeEnv } from '../../etc';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authConfig: AuthConfig,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { isDev } = checkNodeEnv();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic || (isDev && this.authConfig.SKIP_AUTH)) {
      // 💡 See this condition
      return true;
    }

    const request: AuthorizedFastifyRequest = context
      .switchToHttp()
      .getRequest();

    const token =
      request.cookies[COOKIE_ACCESS_TOKEN] ||
      this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: AuthJWTDto = await this.jwtService.verifyAsync(token, {
        secret: this.authConfig.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
