import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';
import { CustomValidationPipe } from './pipes/custom-validation.pipe.js';
import { UsersService } from './users.service.js';
@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}
    @Get()
    find(@Query('name',CustomValidationPipe) name?: string) {
        return this.usersService.getAllUsers();
    }

    @Get(':id')
    findOne(@Param('id',ParseUUIDPipe) id: string) {
        return this.usersService.getUserById(id);
    }

    @Post()
    create(@Body() userData: CreateUserDto) {
      return this.usersService.createUser(userData);
    }
        
     

    @Patch(':id')
    update(@Param('id',ParseUUIDPipe) id: string,@Body() updateData: UpdateUserDto) {
       return this.usersService.updateUser(id,updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id',ParseUUIDPipe) id: string) {
        this.usersService.deleteUser(id);
          }
}