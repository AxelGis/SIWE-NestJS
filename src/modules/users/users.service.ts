import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user by address and create if not exists
   * @param address
   * @returns
   */
  async findUserOrCreate(address: string): Promise<User> {
    return await this.prisma.user.upsert({
      where: {
        address,
      },
      create: {
        address,
      },
      update: {
        //nothing to update
      },
    });
  }

  /**
   * Get user from DB
   * @param address
   * @returns
   */
  async findOne(address: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        address,
      },
    });
  }

  /**
   * Create user into DB
   * @param address
   * @returns
   */
  async createUser(address: string): Promise<User> {
    return await this.prisma.user.create({
      data: {
        address,
      },
    });
  }
}
