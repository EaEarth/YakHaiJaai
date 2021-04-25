import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { createNoti } from './dto/create-notification.dto';
import { updateNoti } from './dto/update-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly service: NotificationService,
    private readonly userService: UserService,
  ) {}

  @Get('current-user')
  async getNotificationFromCurrentUser(@Request() req) {
    const user = await this.userService.getUserFromToken(req.headers.authtoken);
    return this.service.getNotificationFromUid(user.uid);
  }

  @Get('current-user/unreaded')
  async getUnreadedNotificationFromCurrentUser(@Request() req) {
    const user = await this.userService.getUserFromToken(req.headers.authtoken);
    return this.service.getUnreadedNotificationFromUid(user.uid);
  }

  @Get('bill/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async getNotificationFromBillId(@Param('id', new ParseIntPipe()) id: number) {
    return this.service.getNotificationByBillId(id);
  }

  @Post('send')
  sendNotification(@Body() body) {
    return this.service.sendNotification(body);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async storeNotification(@Request() req, @Body() dto: createNoti) {
    const user = await this.userService.getUserInfoByToken(
      req.headers.authtoken,
    );
    return this.service.createNotification(user, dto);
  }

  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateNotification(@Request() req, @Body() dto: updateNoti) {
    const user = await this.userService.getUserInfoByToken(
      req.headers.authtoken,
    );
    return this.service.updateNotification(user, dto);
  }

  @Patch('read/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async readNotification(@Param('id', new ParseIntPipe()) id: number) {
    return this.service.markAsRead(id);
  }

  @Patch('readAll')
  async readAllNotification(@Request() req) {
    const user = await this.userService.getUserInfoByToken(
      req.headers.authtoken,
    );
    return this.service.readAll(user.uid);
  }
}
