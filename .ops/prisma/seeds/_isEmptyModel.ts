import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

export const isEmptyModel = async (model:string) => {
	const count = await prisma[model].count();
  console.log(model, count);
	return count === 0;
}
