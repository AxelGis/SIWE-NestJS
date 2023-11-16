import {
  PaymentsCurrencies,
  SubscriptionPeriod,
  SubscriptionPlan,
} from '@prisma/client';
import { Decimal, JsonValue } from '@prisma/client/runtime/library';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class SubscriptionPeriodResp
  implements
    Pick<SubscriptionPeriod, 'subscriptionPeriodId' | 'name' | 'freeMonths'>
{
  @IsNumber()
  subscriptionPeriodId: number;

  @IsString()
  name: string;

  @IsNumber()
  freeMonths: number;
}

export class SubscriptionPlanResp
  implements
    Pick<
      SubscriptionPlan,
      'subscriptionPlanId' | 'name' | 'basePrice' | 'currency' | 'features'
    >
{
  @IsNumber()
  subscriptionPlanId: number;

  @IsString()
  name: string;

  @IsNumber()
  basePrice: Decimal;

  @IsEnum(PaymentsCurrencies)
  currency: PaymentsCurrencies;

  @IsArray()
  features: JsonValue;
}
