import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/users/user.entity';
import { AppService } from 'src/app.service';
import { Repository } from 'typeorm';
import admin from 'firebase-admin';
import { storeUserInfo } from './dto/storeUserInfo.dto';
import { FileItemService } from 'src/file-item/file-item.service';
import { updateUserInfo } from './dto/updateUserInfo.dto';
import { FcmToken } from 'entities/users/fcmToken.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(FcmToken) private readonly fcmRepo: Repository<FcmToken>,
    private fileService: FileItemService,
  ) {}

  index() {
    return this.repo.find();
  }

  async getUserFromToken(token): Promise<any> {
    const user = await admin
      .auth()
      .verifyIdToken(token)
      .catch((error) => {
        console.log(error);
        throw new UnauthorizedException('Token is not valid');
      });
    return user;
  }

  async storeUserInfo(token, dto: storeUserInfo): Promise<User> {
    const { fcmToken, avatarId, ...info } = dto;
    const user = await this.getUserFromToken(token);
    const userInfo = { ...new User(), ...info };
    userInfo.uid = user.uid;
    userInfo.fcmTokens = [];
    if (avatarId) {
      const file = await this.fileService.findById(avatarId);
      if (file) {
        userInfo.avatarPict = file;
      } else throw new NotFoundException('avatar picture not found');
    } else userInfo.avatarPict = null;
    if (fcmToken) {
      var tokenEntity = await this.fcmRepo.findOne({
        where: { token: fcmToken },
      });
      if (!tokenEntity)
        tokenEntity = await this.storeFcmToken(undefined, fcmToken);
      userInfo.fcmTokens.push(tokenEntity);
    }
    return this.repo.save(userInfo);
  }

  async storeFcmToken(uid, token): Promise<FcmToken> {
    const fcmToken = await this.fcmRepo.findOne({
      where: { token: token },
    });
    var user;
    if (fcmToken) {
      if (uid) {
        user = await this.repo.findOne(uid);
        if (user) {
          var userExists = false;
          for (var i = 0; i < fcmToken.users.length; ++i) {
            if (fcmToken.users[i].uid === uid) {
              userExists = true;
              break;
            }
          }
          if (userExists) return fcmToken;
          fcmToken.users.push(user);
        } else throw new NotFoundException('user not found');
      }
      return fcmToken;
    }
    const tokenEntity = new FcmToken();
    tokenEntity.token = token;
    tokenEntity.users = [];
    if (uid) {
      if (user) user = await this.repo.findOne(uid);
      if (user) {
        tokenEntity.users.push(user);
      } else throw new NotFoundException('user not found');
    }
    return this.fcmRepo.save(tokenEntity);
  }

  async getUserInfoByToken(token): Promise<User | undefined> {
    const user = await this.getUserFromToken(token);
    return this.repo.findOne(user.uid, {
      relations: ['avatarPict', 'fcmTokens'],
    });
  }

  async updateUserInfo(token, dto: updateUserInfo): Promise<User> {
    const { fcmToken, avatarId, ...updatedInfo } = dto;
    const user = await this.getUserInfoByToken(token);
    const newUserInfo = { ...user, ...updatedInfo };
    if (avatarId) {
      const file = await this.fileService.findById(avatarId);
      if (file) {
        newUserInfo.avatarPict = file;
      } else throw new NotFoundException('avatar picture not found');
    }
    if (fcmToken) {
      var isExist = false;
      for (var i = 0; i < user.fcmTokens.length; ++i) {
        if (user.fcmTokens[i].token === fcmToken) {
          isExist = true;
          break;
        }
      }
      if (!isExist) {
        var tokenEntity = await this.fcmRepo.findOne({
          where: { token: fcmToken },
        });
        if (!tokenEntity)
          tokenEntity = await this.storeFcmToken(undefined, fcmToken);
        newUserInfo.fcmTokens.push(tokenEntity);
      }
    }
    return this.repo.save(newUserInfo);
  }

  async searchByName(name: string): Promise<User[]> {
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatarPict', 'picture')
      .where('LOWER(user.username) like %:name%', { name: name.toLowerCase() })
      .orWhere('LOWER(user.firstname) like %:name%', {
        name: name.toLowerCase(),
      })
      .orWhere('LOWER(user.lastname) like %:name%', {
        name: name.toLowerCase(),
      })
      .leftJoinAndSelect('user.fcmTokens', 'token')
      .getMany();
  }

  findById(id: string): Promise<User> {
    return this.repo.findOne(id);
  }
}
