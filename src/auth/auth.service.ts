import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto.js';
import { UserEntity } from '../users/user.entity.js';
import { Repository } from 'typeorm/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto.js';
import type { JwtPayload } from '../uitils/types.js';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dtos/auth-response.dto.js';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService:JwtService

  ) {}

     async register(userData: RegisterDto) {
        const userFromDb=await this.userRepository.findOne({where: {email: userData.email}});
        if(userFromDb){ 
            throw new BadRequestException('User with this email already exists');
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(userData.password,salt);
        const user = this.userRepository.create({ ...userData, password: hashedPassword });
        const savedUser = await this.userRepository.save(user);
        const token = await this.generateToken({
          id: savedUser.id,
          userType: savedUser.userType,
        });
        return { user: savedUser, token };
      }


      
     async login(loginDto: LoginDto) {
        const user =await this.userRepository.findOne({ where: { email: loginDto.email } });
        if (!user) {
          throw new BadRequestException('Invalid credentials');
        }
        const isMatch= await bcrypt.compare(loginDto.password, user.password);
       

        if (!isMatch) {
          throw new BadRequestException('Invalid credentials');
        }
        const token = await this.generateToken({
          id: user.id,
          userType: user.userType,
        });
        return { user, token };
      }

     getProfile(id: string) {
        return this.userRepository.findOne({ where: { id } });
      
     }
      private async generateToken(payload: JwtPayload) {
return this.jwtService.sign(payload);
      }


      
}
