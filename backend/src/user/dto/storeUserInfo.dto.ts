import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  Length,
} from 'class-validator';

export class storeUserInfo {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly prefix: string;

  @IsNotEmpty()
  readonly firstname: string;

  @IsNotEmpty()
  readonly lastname: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(10)
  readonly phoneNumber: string;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  readonly birthDate: Date;

  @IsOptional()
  @IsNumber()
  readonly avatarId: number;
}
