import { Controller, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  SubscriptionPeriodResp,
  SubscriptionPlanResp,
} from 'src/modules/subscriptions/dto/subscriptions.dto';

@Controller('subscriptions')
@ApiTags('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @ApiBearerAuth('JWT-auth')
  @Get('getPeriods')
  getPeriods(): Promise<SubscriptionPeriodResp[]> {
    return this.subscriptionsService.getPeriods();
  }

  @ApiBearerAuth('JWT-auth')
  @Get('getPlans')
  getPlans(): Promise<SubscriptionPlanResp[]> {
    return this.subscriptionsService.getPlans();
  }

  @ApiBearerAuth('JWT-auth')
  @Get('getSubscriptions')
  getSubscriptions() {
    return this.subscriptionsService.getSubscriptions();
  }
}
