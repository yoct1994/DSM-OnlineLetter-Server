import { Body, Controller, Headers, Post, Put } from '@nestjs/common';
import { SignInRequest } from 'src/data/Data';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() signInRequest: SignInRequest) {
    return this.authService.getToken(signInRequest);
  }

  @Put()
  refreshToken(@Headers('X-Refresh-Token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
