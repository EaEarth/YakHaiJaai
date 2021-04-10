import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/users/user.entity';
import { AppService } from 'src/app.service';
import { Repository } from 'typeorm';
import admin from 'firebase-admin';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private appService: AppService,
  ) {}

  getUserFromToken(token) {
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
}
