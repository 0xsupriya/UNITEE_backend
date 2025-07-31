import {IsEmail, IsNotEmpty, MinLength} from 'class-validator'
export class signUpDto{
    @IsEmail()
    email: String

    @IsNotEmpty()
    name: String

    @MinLength(10)
    password: String
}