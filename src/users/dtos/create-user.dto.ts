import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {
     @IsString()
     @IsNotEmpty()
     @Length(3, 50)
     userName: string;
     
     @IsEmail()
     email: string;
     @IsString()
     @IsNotEmpty()
     @Length(6, 20)
     password: string;
}