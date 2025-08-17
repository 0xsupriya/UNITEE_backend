import { Body,Get, Req, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto/signUp.dto";
import { SignInDto } from "./dto/signIn.dto";
import { JwtGuard } from "./jwt.guard";
@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService ){}
    @Post('sign-up')
   signUp(@Body() signUpDto: SignUpDto){
    return this.authService.signUp(signUpDto);
   }

   @Post('sign-in')
   signIn(@Body() signInDto: SignInDto){
    return this.authService.signIn(signInDto);
   }

   @UseGuards(JwtGuard)
   @Get('me')
   getMe(@Req() req: Request){
    return (req as any).user;
   }

}