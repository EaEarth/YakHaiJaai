import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class updateNoti {
  @IsOptional()
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
  readonly isReaded: boolean;

  @IsOptional()
  @IsNumber()
  readonly billId: number;

  @IsOptional()
  readonly usersId: string[];
}
