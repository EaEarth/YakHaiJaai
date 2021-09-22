import {
  IsNotEmpty,
} from 'class-validator';

export class storeUserInfo {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly firstname: string;

  @IsNotEmpty()
  readonly lastname: string;
}
