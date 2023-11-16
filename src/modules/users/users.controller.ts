import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGetNonceDto } from '../auth/dto/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiBearerAuth('JWT-auth')
  @Post('getUser')
  getUser(@Body() { address }: AuthGetNonceDto) {
    return this.userService.findOne(address);
  }
}
