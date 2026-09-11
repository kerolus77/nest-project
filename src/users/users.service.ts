import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./user.entity.js";
import { CreateUserDto } from "./dtos/create-user.dto.js";
import { UpdateUserDto } from "./dtos/update-user.dto.js";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  getAllUsers() {
    return this.userRepository.find();
  }

  getUserById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  createUser(userData: CreateUserDto) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  updateUser(id: string, updateData: UpdateUserDto) {
    return this.userRepository.update(id, updateData);
  }

  deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}