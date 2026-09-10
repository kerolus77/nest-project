import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { UserEntity } from './user.entity.js';
import {v4 as uuid} from 'uuid';
@Controller('users')
export class UsersController {
private users:UserEntity[] = [];
    @Get()
    find() {
        return this.users;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.users.find(user=>user.id ===id);
    }

    @Post()
    create(@Body() userData: CreateUserDto) {
        const newUser:UserEntity={
            id: uuid(),
            ...userData,
            
        }
        this.users.push(newUser);
        return newUser;
    }
        
     

    @Patch(':id')
    update(@Param('id') id: string,@Body() updateData: UpdateUserDto) {
        const userIndex = this.users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return `User with ID: ${id} not found`;
        }

        this.users[userIndex] = { ...this.users[userIndex], ...updateData };
        return this.users[userIndex];
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
       this.users = this.users.filter(user => user.id !== id);
          }
}