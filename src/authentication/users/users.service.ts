import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../database';
import { UpdateUserDto } from './dto/update-user.dto';
import { OptionsDto } from './dto/OptionsDto';
import { UserDto } from './dto/user.dto';

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
    const user = await this.prisma.user.findUnique({
      where: { name },
      include: { region: true },
    });
    if (!user) {
      throw new UnauthorizedException('name or password not valid');
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return new UserDto(user);
  }

  async getUser(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async deleteUser(id) {
    return this.prisma.user.delete({ where: { id } });
  }
  // delete user
  async updateUser(data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id: data.id }, data });
  }

  /***
   * Get all regions
   */
  async getAllUsers(options: OptionsDto): Promise<any> {
    const findArgs = {
      skip: options.skip ?? 0,
      take: options.take ?? 10,
      include: {
        _count: true,
        region: true,
      },
    };
    const result = await this.prisma.user.findMany(findArgs);
    const users = result.map((user) => new UserDto(user));

    const count = await this.prisma.user.aggregate({
      _count: true,
    });
    return { users, count: count._count };
  }
}
