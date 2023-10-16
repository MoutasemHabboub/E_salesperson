import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { DatabaseModule } from '../database/database.module';
import { CommonModule } from '@app/common';
@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    CommonModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        publicKey: Buffer.from(
          configService.get<string>('ACCESS_TOKEN_PUBLIC_KEY'),
          'base64',
        ).toString('ascii'),
        privateKey: Buffer.from(
          configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY'),
          'base64',
        ).toString('ascii'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn:
            configService.get<string>('ACCESS_TOKEN_EXPIRATION') ?? '2h',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthenticationModule {}
