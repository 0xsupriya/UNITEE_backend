import { IsEmail, IsNotEmpty } from "class-validator";

export class signInDto{
    @IsEmail()
    email: String

    @IsNotEmpty()
    password: String
}