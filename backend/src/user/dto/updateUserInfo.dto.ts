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
  readonly prefix: string;

  @IsOptional()
  readonly firstName: string;

  @IsOptional()
  readonly lastName: string;

  @IsOptional()
  @IsNumberString()
  @Length(10)
  readonly phoneNumber: string;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  readonly birthDate: Date;

  @IsOptional()
  @IsNumber()
  readonly avatarId: number;
}
