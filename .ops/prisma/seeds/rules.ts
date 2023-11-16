import { PrismaClient } from '@prisma/client';
import { isEmptyModel } from './_isEmptyModel';

// initialize Prisma Client
const prisma = new PrismaClient();

const rules = [
  {
    image: '/assets/images/market/math.jpeg',
    name: 'raspeg',
    description: 'raspeg',
  },
  {
    image: '/assets/images/market/buy-sell.jpeg',
    name: 'lp_raspeg',
    description: 'lp_raspeg',
  },
  {
    image: '/assets/images/market/st-2.jpeg',
    name: 'token_dump',
    description: 'token_dump',
  },
  {
    image: '/assets/images/market/st-3.jpeg',
    name: 'lp_token_dump',
    description: 'lp_token_dump',
  },
];

export async function rulesSeed(clean: boolean = false) {
	
  if(clean || await isEmptyModel('Rule')){
    const { id: userId } = await prisma.user.upsert({
      where: {
        address: '0xAD'
      },
      update: {},
      create: {
        address: '0xAD'
      }
    });

    await prisma.ruleCode.deleteMany();
    await prisma.rule.deleteMany();
    
    await prisma.rule.createMany({
      data: rules.map(rule => ({ userId, ...rule }))
    });
  } else {
    console.error(`Model Rule is not empty`);
  }
}
