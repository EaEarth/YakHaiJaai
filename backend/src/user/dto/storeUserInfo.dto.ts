import {
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
  readonly firstname: string;

  @IsNotEmpty()
  readonly lastname: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(10)
  readonly phoneNumber: string;

  @IsOptional()
  @IsNumber()
  readonly avatarId: number;
}
