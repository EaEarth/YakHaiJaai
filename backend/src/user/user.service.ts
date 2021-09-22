import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/users/user.entity';
import { Repository } from 'typeorm';
import { storeUserInfo } from './dto/storeUserInfo.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  index() {
    return this.repo.find();
  }

  async storeUserInfo(dto: storeUserInfo): Promise<User> {
    const userInfo = { ...new User(), ...dto };
    return this.repo.save(userInfo);
  }

  async updateUserInfo(dto: storeUserInfo): Promise<User> {
    const user = await this.index();
    const newUserInfo = { ...user[0], ...dto };
    return this.repo.save(newUserInfo);
  }
}
