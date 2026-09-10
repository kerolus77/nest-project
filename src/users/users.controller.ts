import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
@Controller('users')
export class UsersController {

    @Get()
    find() {
        return 'This action returns all users';
    }

    @Get(':id')
    findOne() {
        return 'This action returns a user';
    }

    @Post()
    create() {
        return 'This action creates a new user';
    }

    @Patch(':id')
    update() {
        return 'This action updates a user';
    }

    @Delete(':id')
    remove() {
        return 'This action removes a user';
    }
}