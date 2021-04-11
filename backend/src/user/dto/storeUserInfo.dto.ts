import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class storeUserInfo {
  @IsNotEmpty()
  readonly prefix: string;

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsOptional()
  @IsNumber()
  readonly avatarId: number;
}
