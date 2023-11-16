import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { COOKIE_ACCESS_TOKEN } from './cookie.constants';

@Injectable()
export class CookieService {
  setAccessTokenCookie(response: FastifyReply, token: string) {
    response.setCookie(COOKIE_ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: false,
      path: '/',
    });
  }

  deleteAccessTokenCookie(response: FastifyReply) {
    response.setCookie(COOKIE_ACCESS_TOKEN, null, { path: '/' });

    /* TODO: удалить это fix для очистки cookie старых версий кода */
    response.setCookie(COOKIE_ACCESS_TOKEN, null, { expires: new Date() });
  }
}
