import { PaymentsCurrencies, PrismaClient } from '@prisma/client';
import { isEmptyModel } from './_isEmptyModel';

// initialize Prisma Client
const prisma = new PrismaClient();

export async function subscriptionsSeed(clean: boolean = false) {
	
  if(clean || await isEmptyModel('SubscriptionPeriod')){
    await prisma.subscriptionPeriod.deleteMany();
    //create basic subscription periods
    await prisma.subscriptionPeriod.createMany({
      data: [
        {
          name: 'monthly',
          freeMonths: 0,
        },
        {
          name: 'yearly',
          freeMonths: 2,
        }
      ]
    });
  } else {
    console.error(`Model SubscriptionPeriod is not empty`);
  }

  if(clean || await isEmptyModel('SubscriptionPlan')){
    await prisma.subscriptionPlan.deleteMany();
    //create basic subscription plans
    await prisma.subscriptionPlan.createMany({
      data: [
        {
          name: 'basic',
          basePrice: 50,
          currency: PaymentsCurrencies.USDT,
          features: [  
            'assets5',
            'checks1in5m',
          ],
        },
        {
          name: 'premium',
          basePrice: 200,
          currency: PaymentsCurrencies.USDT,
          features: [
            'assets20',
            'checks1in2m',
          ],
        },
        {
          name: 'ultimate',
          basePrice: 500,
          currency: PaymentsCurrencies.USDT,
          features: [  
            'assetsUnlimited',
            'checks1in30s',
          ],
        }
      ]
    });
  } else {
    console.error(`Model SubscriptionPlan is not empty`);
  }
}
