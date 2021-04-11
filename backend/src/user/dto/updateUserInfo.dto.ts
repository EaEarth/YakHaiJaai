import { IsNumber, IsOptional } from 'class-validator';

export class updateUserInfo {
  @IsOptional()
  readonly prefix: string;

  @IsOptional()
  readonly firstName: string;

  @IsOptional()
  readonly lastName: string;

  @IsOptional()
  readonly phoneNumber: string;

  @IsOptional()
  @IsNumber()
  readonly avatarId: number;
}
