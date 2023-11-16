import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SaveRuleCodeDto, SaveRuleDto } from './dto/rules.dto';
import { AuthorizedFastifyRequest } from '../auth/dto/auth.dto';

@Controller('rules')
@ApiTags('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @ApiBearerAuth('JWT-auth')
  @Get('getRules')
  getRules() {
    return this.rulesService.getRules();
  }

  @ApiBearerAuth('JWT-auth')
  @Get('getRule/:id')
  getRule(@Param('id') id: string) {
    return this.rulesService.getRuleById(+id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('getRuleCode/:id')
  getRuleCode(@Param('id') id: string) {
    return this.rulesService.getRuleCode(+id);
  }

  @ApiBearerAuth('JWT-auth')
  @Put('saveRule')
  saveRule(
    @Request() req: AuthorizedFastifyRequest,
    @Body() rule: SaveRuleDto,
  ) {
    const { userId } = req.user;
    return this.rulesService.saveRule(rule, userId);
  }

  @ApiBearerAuth('JWT-auth')
  @Post('saveRuleCode/:id')
  saveRuleCode(
    @Request() req: AuthorizedFastifyRequest,
    @Param('id') id: string,
    @Body() { code }: SaveRuleCodeDto,
  ) {
    const { userId } = req.user;
    return this.rulesService.saveRuleCode(+id, code, userId);
  }

  @ApiBearerAuth('JWT-auth')
  @Delete('deleteRule/:id')
  deleteRule(@Param('id') id: string) {
    return this.rulesService.deleteRule(+id);
  }
}
