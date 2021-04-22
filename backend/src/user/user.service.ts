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
    const { avatarId, ...info } = dto;
    const user = await this.getUserFromToken(token);
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

  async getUserInfoByToken(token): Promise<User | undefined> {
    const user = await this.getUserFromToken(token);
    return this.repo.findOne(user.uid, {
      relations: ['avatarPict'],
    });
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

  async searchByName(name: string): Promise<User[]> {
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatarPict', 'picture')
      .where('LOWER(user.username) like :name', { name: name.toLowerCase() })
      .orWhere('LOWER(user.firstname) like :name', { name: name.toLowerCase() })
      .orWhere('LOWER(user.lastname) like :name', { name: name.toLowerCase() })
      .getMany();
  }

  findById(id: number): Promise<User> {
    return this.repo.findOne(id);
  }
}
