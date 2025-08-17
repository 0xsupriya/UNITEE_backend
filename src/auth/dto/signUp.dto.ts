import {IsEmail, IsNotEmpty, MinLength} from 'class-validator'
export class SignUpDto{
    @IsEmail()
    email: string

    @IsNotEmpty()
    name: string

    @MinLength(10)
    password: string
}