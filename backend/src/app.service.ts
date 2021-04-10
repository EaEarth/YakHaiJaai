import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  initializeFirebaseAdmin() {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_KEY_PATH),
    });
  }
}
