import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('')
@ApiTags('healthchecks')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/healthz')
  @ApiOperation({ summary: 'basic healthcheck' })
  @ApiResponse({
    status: 200,
    schema: { type: 'text/plain', example: 'OK' },
  })
  checkHealth() {
    return this.appService.checkHealth();
  }
}
