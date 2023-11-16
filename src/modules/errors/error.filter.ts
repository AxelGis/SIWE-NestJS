import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { Response } from '../app/app.interceptor';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: FastifyReply = ctx.getResponse();
    const status: number = exception.getStatus();
    const errorMessage: string = exception.message;

    Logger.error(exception.getResponse());

    const responseObject: Response<null> = {
      result: null,
      errorCode: status,
      errorMessage: errorMessage,
    };

    response.status(200).send(responseObject);
  }
}
