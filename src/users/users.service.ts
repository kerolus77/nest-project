import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { Repository } from "typeorm";
import { UserType } from '../uitils/enums.js';
import type { JwtPayload } from '../uitils/types.js';
import { UpdateUserDto } from "./dtos/update-user.dto.js";
import { UserEntity } from "./user.entity.js";

@Injectable()
export class UsersService {
  private readonly uploadDirectory = path.resolve(process.cwd(), 'uploads', 'users');

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

  async updateUser(id: string, updateData: UpdateUserDto, image: Express.Multer.File | undefined, jwtPayload: JwtPayload) {
    const user = await this.getUserById(id);
    this.assertCanManageUser(user.id, jwtPayload);

    const oldImageUrl = user.imageUrl;
    let imageUrl = oldImageUrl;

    if (image) {
      await fs.mkdir(this.uploadDirectory, { recursive: true });
      const extension = path.extname(image.originalname).toLowerCase();
      const fileName = `${randomUUID()}${extension}`;
      await fs.writeFile(path.join(this.uploadDirectory, fileName), image.buffer);
      imageUrl = `/uploads/users/${fileName}`;
    }

    try {
      await this.userRepository.save({ ...user, ...updateData, imageUrl });
    } catch (error) {
      if (imageUrl !== oldImageUrl) {
        await this.removeImageFile(imageUrl);
      }
      throw error;
    }

    if (imageUrl !== oldImageUrl) {
      await this.removeImageFile(oldImageUrl);
    }

    return this.getUserById(id);
  }

  async removeUserImage(id: string, jwtPayload: JwtPayload) {
    const user = await this.getUserById(id);
    this.assertCanManageUser(user.id, jwtPayload);

    if (!user.imageUrl) {
      return user;
    }

    const oldImageUrl = user.imageUrl;
    await this.userRepository.save({ ...user, imageUrl: null });
    await this.removeImageFile(oldImageUrl);
    return this.getUserById(id);
  }

 async deleteUser(id: string,jwtPayload:JwtPayload) {
    const user =await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.id === jwtPayload.id||UserType.ADMIN === jwtPayload.userType) {
      const result = await this.userRepository.delete(id);
      await this.removeImageFile(user.imageUrl);
      return result;
    }
    throw new Error('Unauthorized');
  }

  private assertCanManageUser(userId: string, jwtPayload: JwtPayload) {
    if (userId !== jwtPayload.id && UserType.ADMIN !== jwtPayload.userType) {
      throw new ForbiddenException('You can only update your own profile');
    }
  }

  private async removeImageFile(imageUrl: string | null) {
    if (!imageUrl) {
      return;
    }

    const fileName = path.basename(imageUrl);
    await fs.rm(path.join(this.uploadDirectory, fileName), { force: true });
  }
}