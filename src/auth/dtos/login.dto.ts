import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class LoginDto{
 @IsString()
     
     @IsEmail()
     email: string;
        @IsString()
     @IsNotEmpty()
     @Length(6, 20)
     password: string;
}