import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

export class updateUserInfo {
  @IsOptional()
  readonly username: string;

  @IsOptional()
  readonly firstName: string;

  @IsOptional()
  readonly lastName: string;

  @IsOptional()
  @IsNumberString()
  @Length(10)
  readonly phoneNumber: string;

  @IsOptional()
  @IsNumber()
  readonly avatarId: number;
}
