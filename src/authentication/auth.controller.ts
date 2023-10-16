import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  ApiBody,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { SignupUserDto } from './dto/signup.dto';
import { CurrentUser } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiOkResponse({
    //type: UserDto,
    status: 200,
    description: 'User profile',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
    status: HttpStatus.UNAUTHORIZED,
  })
  async login(@CurrentUser() user, @Body() data: LoginUserDto) {
    console.log(data);
    return await this.authService.login(user);
  }

  @Post('signup')
  async signUp(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUp(signupUserDto);
  }
  @UseGuards(JwtAuthGuard)
  async authenticate(@CurrentUser() user) {
    return user;
  }
}
