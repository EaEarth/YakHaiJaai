import { IsOptional, IsString } from "class-validator";

export class createFile{

    @IsOptional()
    @IsString()
    readonly title: string;

}