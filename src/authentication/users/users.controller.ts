import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '@app/common';
import { ROLE } from '../enum/role.enum';
import { RoleGuard } from '../guards/role.guard';
import { UpdateUserDto } from './dto/update-user.dto';
@ApiBearerAuth()
@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user) {
    return user;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(@CurrentUser() user, @Body() data: UpdateUserDto) {
    data.id = user.id;
    return await this.usersService.updateUser(data);
  }

  @Put('user')
  @UseGuards(RoleGuard([ROLE.ADMIN]))
  async updateUserById(@Body() data: UpdateUserDto) {
    return await this.usersService.updateUser(data);
  }
  @Put()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@CurrentUser() user) {
    return await this.usersService.deleteUser(user.id);
  }

  @Put(':id')
  @UseGuards(RoleGuard([ROLE.ADMIN]))
  async deleteUserById(@Param('id') id: number) {
    return await this.usersService.deleteUser(id);
  }
}
