import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { PrismaService } from '../database';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(user) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
      name: user.name,
      regionId: user.regionId,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const privateKey = this.configService.get<string>(
      'ACCESS_TOKEN_PRIVATE_KEY',
    );
    const issuer = `${this.configService.get('ENV')}.${this.configService.get(
      'ISSUER',
    )}`;
    const token: string = this.jwtService.sign(tokenPayload, {
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      privateKey,
      issuer,
    });
    return {
      userId: user.id,
      photo: user.photo,
      number: user.number,
      regionId: user.regionId,
      role: user.role,
      accessToken: token,
    };
  }
  async signUp(data) {
    const user = await this.userService.create(data);
    const tokenPayload: TokenPayload = {
      userId: user.id,
      name: user.name,
      regionId: user.regionId,
    };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    const privateKey = this.configService.get<string>(
      'ACCESS_TOKEN_PRIVATE_KEY',
    );
    const issuer = `${this.configService.get('ENV')}.${this.configService.get(
      'ISSUER',
    )}`;
    const token: string = this.jwtService.sign(tokenPayload, {
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      privateKey,
      issuer,
    });
    return {
      userId: user.id,
      photo: user.photo,
      number: user.number,
      regionId: user.regionId,
      role: user.role,
      accessToken: token,
    };
  }
}
