import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'entities/users/user.entity';
import { storeUserInfo } from './dto/storeUserInfo.dto';
import { updateUserInfo } from './dto/updateUserInfo.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('current-user')
  getCurrentUser(@Request() req) {
    return this.service.getUserFromToken(req.headers.authtoken);
  }

  @Get('current-user/info')
  getCurrentUserInfo(@Request() req): Promise<User> {
    return this.service.getUserInfoByToken(req.headers.authtoken);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  storeUserInfo(@Request() req, @Body() dto: storeUserInfo): Promise<User> {
    return this.storeUserInfo(req.headers.authtoken, dto);
  }

  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateUserInfo(@Request() req, @Body() dto: updateUserInfo): Promise<User> {
    for (const [key, value] of Object.entries(dto)) {
      if (value == null || value === '') {
        delete dto[key];
      }
    }
    return this.service.updateUserInfo(req.headers.authtoken, dto);
  }
}
