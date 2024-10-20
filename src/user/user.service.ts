import {ConflictException, HttpException, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  private readonly prisma = new PrismaClient();

  constructor() {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    //check to confirm if user data already exist in the data
    const user = await this.findUserByEmail(createUserDto.email);

    // if user already exist, return an exception
    if (user) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = await argon2.hash(createUserDto.password);

    const createdUSer = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword
      },
    });

    console.log(createdUSer);

    throw new HttpException("User created successfully", 200);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findUserByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,  // Searching for a unique email
      },
    });

    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
