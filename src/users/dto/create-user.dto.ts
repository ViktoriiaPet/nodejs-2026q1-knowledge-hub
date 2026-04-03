import { IsString, IsNotEmpty, IsOptional, IsIn, isString } from "class-validator";
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    login: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsIn(['admin','editor', 'viewer'])
    role?: 'admin' | 'editor' | 'viewer' 
}
