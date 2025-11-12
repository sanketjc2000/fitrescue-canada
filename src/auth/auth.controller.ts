import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.signupWithEmail(email, password);
  }

  @Post('login')
  async login(@Body('email') email: string, @Body('password') password: string) {
    return this.authService.loginWithEmail(email, password);
  }

  @Get('google')
  async googleLogin() {
    return this.authService.loginWithGoogle();
  }

  @Get('apple')
  async appleLogin() {
    return this.authService.loginWithApple();
  }
}
