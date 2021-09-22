import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  // initializeFirebaseAdmin() {
  //   admin.initializeApp({
  //     credential: admin.credential.cert(process.env.FIREBASE_KEY_PATH),
  //   });
  // }
}
