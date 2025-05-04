import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findOneByUsername(username: string): Promise<Users | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined; // 确保 null → undefined
  }

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 哈希加密,盐值为10
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword, // 覆写加密后的password
    });
    return this.usersRepository.save(newUser);
  }
}