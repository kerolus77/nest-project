import { Injectable } from "@nestjs/common";
import { UserEntity } from "./user.entity.js";
import { CreateUserDto } from "./dtos/create-user.dto.js";
import { UpdateUserDto } from "./dtos/update-user.dto.js";
import {v4 as uuid} from 'uuid';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];

  getAllUsers(): UserEntity[] {
    return this.users;
  }
  getUserById(id: string)  {
     return this.users.find(user=>user.id ===id);
  }
  createUser(userData: CreateUserDto): UserEntity {
      const newUser:UserEntity={
                id: uuid(),
                ...userData,
                
            }
            this.users.push(newUser);
            return newUser;
  }
  updateUser(id: string, updateData: UpdateUserDto) {
     const userIndex = this.users.findIndex(user => user.id === id);
            if (userIndex === -1) {
                return `User with ID: ${id} not found`;
            }
    
            this.users[userIndex] = { ...this.users[userIndex], ...updateData };
            return this.users[userIndex];
  }
  deleteUser(id: string): void {
           this.users = this.users.filter(user => user.id !== id);

  }
}