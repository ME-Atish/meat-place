import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UserService } from './user.service';
import { User } from 'src/modules/auth/user.entity';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';

@ApiBearerAuth()
@Controller(`v${process.env.VERSION}/user`)
@UseGuards(AuthGuard('jwt-access'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.userService.getOne(id);
  }

  @Patch('/:id/ban')
  banUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.banUser(id);
  }

  @Patch('/:id/un-ban')
  unBanUSer(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.unBanUser(id);
  }

  @Patch('/:id/role')
  changeRole(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.changeRole(id);
  }

  @Put('/:id')
  updateInfo(@Req() req, @Body() createUserDto: CreateUserDto): Promise<void> {
    const id = req.user.id;
    return this.userService.updateInfo(id, createUserDto);
  }

  @Delete('/:id')
  removeUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.removeUser(id);
  }
}
