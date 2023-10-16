import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/database';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      },
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ name: createUserDto.name }],
        },
      });
      if (user) {
        throw new UnprocessableEntityException('username already exists.');
      }
      return true;
    } catch (err) {
      return err;
    }
  }

  async verifyUser(name: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { name } });
    if (!user) {
      throw new UnauthorizedException('name or password not valid');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(userId) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
  // delete user
  // update user by id
  // update user
}
