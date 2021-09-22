import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'entities/users/user.entity';
import { storeUserInfo } from './dto/storeUserInfo.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  index() {
    return this.service.index();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async storeUserInfo(@Body() dto: storeUserInfo): Promise<User> {
    const user = await this.service.index();
    if (!user[0]) return this.service.storeUserInfo(dto);
    return this.service.updateUserInfo(dto);
  }
}
