import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SubscriptionPeriodResp,
  SubscriptionPlanResp,
} from 'src/modules/subscriptions/dto/subscriptions.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get available periods
   * @returns
   */
  async getPeriods(): Promise<SubscriptionPeriodResp[]> {
    return await this.prisma.subscriptionPeriod.findMany({
      select: {
        subscriptionPeriodId: true,
        name: true,
        freeMonths: true,
      },
    });
  }

  /**
   * Get plans
   * @returns
   */
  async getPlans(): Promise<SubscriptionPlanResp[]> {
    return await this.prisma.subscriptionPlan.findMany({
      select: {
        subscriptionPlanId: true,
        name: true,
        basePrice: true,
        currency: true,
        features: true,
      },
    });
  }

  /**
   * Get subscriptions widget data
   * @returns
   */
  async getSubscriptions() {
    const periods: SubscriptionPeriodResp[] = await this.getPeriods();
    const plans: SubscriptionPlanResp[] = await this.getPlans();
    const prices = periods.reduce((acc, period) => {
      plans.forEach((plan) => {
        acc[`${period.subscriptionPeriodId}_${plan.subscriptionPlanId}`] =
          this.calcSubscriptionPlanPrice(plan.basePrice, period.freeMonths);
      });
      return acc;
    }, {});

    return { periods, plans, prices };
  }

  /**
   * Calc price with freeMonths discount
   * @param price
   * @param freeMonths
   * @returns
   */
  calcSubscriptionPlanPrice(price: Decimal, freeMonths: number) {
    return new Decimal(price)
      .mul(12 - freeMonths)
      .div(12)
      .floor();
  }
}
