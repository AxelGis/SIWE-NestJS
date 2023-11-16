import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveRuleDto } from 'src/modules/rules/dto/rules.dto';
import { randomInt } from 'node:crypto';

@Injectable()
export class RulesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get rules by filter
   * @param isActive
   * @returns
   */
  async getRules(isActive = true) {
    const rules = await this.prisma.rule.findMany({
      where: {
        isActive,
      },
      select: {
        ruleId: true,
        image: true,
        name: true,
        description: true,
        isActive: true,
        ruleCodes: true,
      },
    });

    return rules.map((rule) => ({
      ruleId: rule.ruleId,
      image: rule.image,
      name: rule.name,
      description: rule.description,
      isActive: rule.isActive,
      version:
        rule.ruleCodes.length > 0
          ? rule.ruleCodes[rule.ruleCodes.length - 1].version
          : 0,
    }));
  }

  /**
   * Get rule by Id
   * @param ruleId
   * @returns
   */
  async getRuleById(ruleId: number) {
    return await this.prisma.rule.findFirst({
      where: {
        ruleId,
      },
      select: {
        ruleId: true,
        image: true,
        name: true,
        description: true,
        isActive: true,
      },
    });
  }

  /**
   * Check if user is rule owner
   * @param ruleId
   * @param userId
   * @returns
   */
  async isRuleOwner(ruleId: number, userId: number) {
    const rule = await this.prisma.rule.findFirst({
      where: {
        ruleId,
      },
    });

    return rule?.userId === userId;
  }

  /**
   * Edit rule
   * @param rule
   * @param userId
   * @returns
   */
  async editRule(rule: SaveRuleDto, userId: number) {
    if (!(await this.isRuleOwner(rule.ruleId, userId))) {
      throw new BadRequestException(`Access denied to edit rule`);
    }

    return this.prisma.rule.update({
      where: {
        ruleId: rule.ruleId,
      },
      data: rule,
    });
  }

  /**
   * Create new rule
   * @param rule
   * @param userId
   * @returns
   */
  async createRule(rule: SaveRuleDto, userId: number) {
    return this.prisma.rule.create({
      data: {
        name: rule.name,
        description: rule.description,
        image: `/assets/images/market/st-${randomInt(2, 5)}.jpeg`,
        userId,
      },
    });
  }

  /**
   * Save rule
   * @param rule
   * @param userId
   * @returns
   */
  async saveRule(rule: SaveRuleDto, userId: number) {
    if (rule.ruleId) {
      return await this.editRule(rule, userId);
    } else {
      return await this.createRule(rule, userId);
    }
  }

  /**
   * Delete rule
   * @param id
   * @returns
   */
  async deleteRule(ruleId: number) {
    await this.prisma.rule.update({
      where: {
        ruleId,
      },
      data: {
        isActive: false,
      },
    });
  }

  /**
   * Get rule code
   * @param ruleId
   * @returns
   */
  async getRuleCode(ruleId: number) {
    const ruleCode = await this.prisma.ruleCode.findFirst({
      where: {
        ruleId,
      },
      orderBy: {
        version: 'desc',
      },
      select: {
        code: true,
        version: true,
      },
    });

    return ruleCode?.code;
  }

  /**
   * Save new rule code
   * @param ruleId
   * @param code
   * @param userId
   * @returns
   */
  async saveRuleCode(ruleId: number, code: string, userId: number) {
    if (!(await this.isRuleOwner(ruleId, userId))) {
      throw new BadRequestException(`Access denied to edit rule code`);
    }

    const ruleCode = await this.prisma.ruleCode.findFirst({
      where: {
        ruleId,
      },
      orderBy: {
        version: 'desc',
      },
      select: {
        version: true,
      },
    });

    return this.prisma.ruleCode.create({
      data: {
        code,
        ruleId,
        version: ruleCode ? ruleCode.version + 1 : 1,
      },
    });
  }
}
