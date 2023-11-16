import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export const Cookies = createParamDecorator(
  (
    { cookie, signed = false }: { cookie: string; signed: boolean },
    ctx: ExecutionContext,
  ) => {
    const request: FastifyRequest = ctx.switchToHttp().getRequest();
    return cookie
      ? signed
        ? request.unsignCookie(request.cookies?.[cookie]).valid
          ? request.unsignCookie(request.cookies?.[cookie]).value
          : null
        : request.cookies?.[cookie]
      : request.cookies;
  },
);
