import {Controller, Post, Body, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {LocalAuthGuard} from "./local-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any){
    return await this.authService.loginAccount(req);
  }

  @Post("/verify-otp")
  async verifyOtp(@Body() userData: { email: string; otp: string; }){
    return this.authService.verifyOTP(userData.email, "Otp verification email", userData.otp);
  }

  @Post("/resent-otp")
  async resendOtp(@Body() data: { email: string; }){
    return this.authService.sendOTP(data.email, "Otp verification email");
  }
}