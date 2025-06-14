import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto, signUpDto } from './dto/signup.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}
  @Post('/sign-up')
  signUp(@Body() dto: signUpDto) {
    return this.service.signUp(dto);
  }

  @Post('/sign-in')
  signIn(@Body() dto: signInDto) {
    return this.service.signIn(dto);
  }
}
