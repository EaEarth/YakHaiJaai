import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class createNoti {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsOptional()
  readonly description: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly payDate: Date;

  @IsOptional()
  @IsBoolean()
  readonly isReaded: Boolean;

  @IsNotEmpty()
  @IsNumber()
  readonly billId: number;

  @IsOptional()
  readonly usersId: string[];
}
