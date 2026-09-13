import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserType } from '../uitils/enums.js';
import type { JwtPayload } from '../uitils/types.js';
import { UpdateUserDto } from "./dtos/update-user.dto.js";
import { UserEntity } from "./user.entity.js";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  getAllUsers() {
    return this.userRepository.find();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // createUser(userData: CreateUserDto) {
  //   const user = this.userRepository.create(userData);
  //   return this.userRepository.save(user);
  // }

  updateUser(id: string, updateData: UpdateUserDto) {
    return this.userRepository.update(id, updateData);
  }

 async deleteUser(id: string,jwtPayload:JwtPayload) {
    const user =await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.id === jwtPayload.id||UserType.ADMIN === jwtPayload.userType) {
      return this.userRepository.delete(id);
    }
    throw new Error('Unauthorized');
  }
}