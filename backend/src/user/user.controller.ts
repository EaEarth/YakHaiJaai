import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('current-user')
  async getCurrentUser(@Request() req) {
    return this.service.getUserFromToken(req.headers.authtoken);
  }
}
