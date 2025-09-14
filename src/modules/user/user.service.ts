import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/modules/auth/user.entity';
import { CreateUserDto } from 'src/modules/auth/dto/create-user.dto';
import { AuthRole } from 'src/modules/auth/enums/auth-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async getOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException();
    return user;
  }

  async banUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    await this.userRepository.update(user.id, { isBan: true });
    return;
  }

  async unBanUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    await this.userRepository.update(user.id, { isBan: false });
    return;
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    await this.userRepository.remove(user);

    return;
  }

  async updateInfo(id: string, createUserDto: CreateUserDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    const { username, firstName, lastName, email, phone, password } =
      createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.update(user.id, {
      username,
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
    });

    return;
  }

  async changeRole(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException();

    const newRole =
      user.role === AuthRole.ADMIN ? AuthRole.USER : AuthRole.ADMIN;

    await this.userRepository.update(user.id, { role: newRole });
    return;
  }
}
