import { parseArgs } from 'node:util'
import { PrismaClient } from '@prisma/client';
import { subscriptionsSeed } from './seeds/subscriptions';
import { rulesSeed } from './seeds/rules';

const prisma = new PrismaClient();

const options = {
  env: {
    type: 'string',
  },
  clean: {
    type: 'boolean',
  },
} as const;

async function main() {
  const { values: { env, clean } } = parseArgs({ options });
  console.log('Options',{ env, clean });

  switch (env) {
    case 'dev':
      await subscriptionsSeed(clean);
      await rulesSeed(clean);
      break;

    case 'prod':
      await subscriptionsSeed();
      await rulesSeed();
      break;

    default:
      break;
  }

  console.log(`Seeding ${env} done!`)
}

main()
	.catch((e) => console.error(e))
	.finally(async () => {
		await prisma.$disconnect();
	});
