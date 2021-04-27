import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BillNotification } from 'entities/notifications/notification.entity';
import { User } from 'entities/users/user.entity';
import { BillService } from 'src/bill/bill.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import admin from 'firebase-admin';
import { createNoti } from './dto/create-notification.dto';
import { updateNoti } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(BillNotification)
    private readonly notificationRepo: Repository<BillNotification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly billService: BillService,
    private readonly userService: UserService,
  ) {}

  getNotificationFromUid(uid: string): Promise<BillNotification[]> {
    return this.notificationRepo
      .createQueryBuilder('notification')
      .leftJoin('notification.user', 'user')
      .where('user.uid = :uid', { uid: uid })
      .leftJoinAndSelect('notification.bill', 'bill')
      .getMany();
  }

  getUnreadedNotificationFromUid(uid: string): Promise<BillNotification[]> {
    return this.notificationRepo
      .createQueryBuilder('notification')
      .where('notification.isReaded = :isReaded', { isReaded: false })
      .leftJoin('notification.user', 'user')
      .where('user.uid = :uid', { uid: uid })
      .leftJoinAndSelect('notification.bill', 'bill')
      .getMany();
  }

  async createNotification(creator: User, dto: createNoti) {
    const { usersId, billId, ...info } = dto;
    if (!info['isReaded']) info['isReaded'] = false;
    if (!info['payDate']) info['payDate'] = new Date(Date.now());
    const bill = await this.billService.getBillById(billId);
    var notification = { ...new BillNotification(), ...info };
    notification.bill = bill;
    notification.user = creator;
    await this.notificationRepo.save(notification);
    if (!usersId) return;
    var user;
    usersId.forEach(async (uid) => {
      if (uid !== creator.uid) {
        user = await this.userService.findById(uid);
        var notification = { ...new BillNotification(), ...info };
        notification.bill = bill;
        notification.user = user;
        await this.notificationRepo.save(notification);
      }
    });
    return;
  }

  async updateNotification(user: User, dto: updateNoti) {
    const { billId, usersId, ...updateInfo } = dto;
    const notifications = await this.getNotificationByBillId(billId);
    if (notifications.length === 0) {
      this.createNotification(user, dto);
      return;
    }
    var newNoti;
    var users = new Set(usersId);
    notifications.forEach(async (noti) => {
      if (users.has(noti.user.uid)) users.delete(noti.user.uid);
      newNoti = { ...noti, ...updateInfo };
      await this.notificationRepo.save(newNoti);
    });
    if (users.size === 0) return;
    var notiEntity, userEntity;
    const bill = await this.billService.getBillById(billId);
    for (let uid of users) {
      notiEntity = new BillNotification();
      notiEntity.title = newNoti.title;
      notiEntity.description = newNoti.description;
      notiEntity.payDate = newNoti.payDate;
      notiEntity.isReaded = false;
      notiEntity.bill = bill;
      userEntity = await this.userService.findById(uid);
      notiEntity.user = userEntity;
      await this.notificationRepo.save(notiEntity);
    }
    return;
  }

  async sendNotification(body) {
    if(!body.registrationTokens.length) return
    let tokenSet = new Set()
    for(let i = 0; i<body.registrationTokens.length; ++i){
      tokenSet.add(body.registrationTokens[i])
    }
    let token = []
    for (let item of tokenSet){
      token.push(item)
    }
    const message = {
      data: body.data,
      tokens: token,
    };

    admin
      .messaging()
      .sendMulticast(message)
      .then((response) => {
        // console.log(response.responses)
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            if (!resp.success) {
              failedTokens.push(message.tokens[idx]);
            }
          });
          message.tokens = failedTokens;
          admin.messaging().sendMulticast(message);
        }
      });
  }

  async markAsRead(id: number) {
    const notification = await this.notificationRepo.findOne(id);
    notification.isReaded = true;
    this.notificationRepo.save(notification);
    return;
  }

  async readAll(uid: string) {
    const user = await this.userRepo.findOne(uid, {
      relations: ['notifications'],
    });
    user.notifications.forEach(async (noti) => {
      noti.isReaded = true;
      await this.notificationRepo.save(noti);
    });
    return;
  }

  getNotificationByBillId(id: number): Promise<BillNotification[]> {
    return this.notificationRepo
      .createQueryBuilder('notification')
      .leftJoin('notification.bill', 'bill')
      .where('bill.id = :id', { id: id })
      .getMany();
  }
}
