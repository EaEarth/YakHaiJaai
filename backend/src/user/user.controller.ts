import {
  Body,
  Controller,
  Get,
  Param,
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

  @Get()
  index() {
    return this.service.index();
  }

  @Get('current-user')
  getCurrentUser(@Request() req) {
    return this.service.getUserFromToken(req.headers.authtoken);
  }

  @Get('current-user/info')
  getCurrentUserInfo(@Request() req): Promise<User | undefined> {
    return this.service.getUserInfoByToken(req.headers.authtoken);
  }

  @Get('search/:name')
  async searchUserByName(
    @Param('name') name: string,
    @Request() req,
  ): Promise<User[]> {
    await this.service.getUserFromToken(req.headers.authtoken);
    return this.service.searchByName(name);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  storeUserInfo(@Request() req, @Body() dto: storeUserInfo): Promise<User> {
    return this.service.storeUserInfo(req.headers.authtoken, dto);
  }

  @Post()
  storeFcmToken(@Request() req, @Body() dto: storeUserInfo): Promise<User> {
    return this.service.storeUserInfo(req.headers.authtoken, dto);
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
