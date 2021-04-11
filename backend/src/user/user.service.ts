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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private appService: AppService,
    private fileService: FileItemService,
  ) {}

  getUserFromToken(token): any {
    this.appService.initializeFirebaseAdmin();
    admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        return decodedToken;
      })
      .catch((error) => {
        console.log(error);
        throw new UnauthorizedException('Token is not valid');
      });
  }

  async storeUserInfo(token, dto: storeUserInfo): Promise<User> {
    const { avatarId, ...info } = dto;
    const user = this.getUserFromToken(token);
    const userInfo = { ...new User(), ...info };
    userInfo.uid = user.uid;
    if (avatarId) {
      const file = await this.fileService.findById(avatarId);
      if (file) {
        userInfo.avatarPict = file;
      } else throw new NotFoundException('avatar picture not found');
    } else userInfo.avatarPict = null;
    return this.repo.save(userInfo);
  }

  getUserInfoByToken(token): Promise<User | undefined> {
    const user = this.getUserFromToken(token);
    return this.repo.findOne(user.uid);
  }

  async updateUserInfo(token, dto: updateUserInfo): Promise<User> {
    const { avatarId, ...updatedInfo } = dto;
    const user = await this.getUserInfoByToken(token);
    const newUserInfo = { ...user, ...updatedInfo };
    if (avatarId) {
      const file = await this.fileService.findById(avatarId);
      if (file) {
        newUserInfo.avatarPict = file;
      } else throw new NotFoundException('avatar picture not found');
    }
    return this.repo.save(newUserInfo);
  }
}
