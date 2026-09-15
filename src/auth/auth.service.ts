import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from "node:crypto";
import { Repository } from 'typeorm/repository/Repository.js';
import { MailService } from '../mail/mail.service.js';
import type { JwtPayload } from '../uitils/types.js';
import { UserEntity } from '../users/user.entity.js';
import { LoginDto } from './dtos/login.dto.js';
import { RegisterDto } from './dtos/register.dto.js';
import { ResetPasswordDto } from './dtos/resetPassword.dto.js';
import { ForgotPasswordDto } from './dtos/forgetPassword.dto.js';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService:JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService

  ) {}

     async register(userData: RegisterDto) {
        const userFromDb=await this.userRepository.findOne({where: {email: userData.email}});
        if(userFromDb){ 
            throw new BadRequestException('User with this email already exists');
        }
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(userData.password,salt);
        const user = this.userRepository.create({ 
          ...userData, 
          password: hashedPassword,
          verificationToken: randomBytes(32).toString('hex'),
          verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });
        
        const savedUser = await this.userRepository.save(user);
        await this.mailService.sendVerificationEmail(savedUser.email, `${this.configService.get('APP_URL')}/verify-email?token=${savedUser.verificationToken}`);
        return { user: savedUser,  };
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

        if(!user.isAccountVerified){
          let verificationToken=user.verificationToken
          if(!verificationToken){
            verificationToken=randomBytes(32).toString('hex');
            user.verificationToken=verificationToken;
            user.verificationTokenExpiry=new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
            await this.userRepository.save(user);

          }
          const link=this.generateLink(user.id, verificationToken);
          await this.mailService.sendVerificationEmail(user.email, link);
          return { message: 'Please verify your email. A verification link has been sent to your email address.' };
        }
         this.mailService.sendLoginEmail(user.email);
        const token = await this.generateToken({
          id: user.id,
          userType: user.userType,
        });
        return { user, token };
      }

     getProfile(id: string) {
        return this.userRepository.findOne({ where: { id } });
      
     }
     
     async  verifyEmail(token: string,id: string) {
       const user=await  this.userRepository.findOneBy({id});
       if(!user || user?.verificationToken !== token || !user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()){
         throw new BadRequestException('Invalid or expired verification token');
        }
        
        user.isAccountVerified=true;
        user.verificationToken=null;
        user.verificationTokenExpiry=null;
    await this.userRepository.save(user);
    return { message: 'Email verified successfully' };
  }

  async forgetPassword(dto: ForgotPasswordDto) {
   const user = await this.userRepository.findOne({ where: { email: dto.email } });
   if(!user){
    throw new BadRequestException('User with this email does not exist');
   }
    const resetPasswordToken = randomBytes(32).toString('hex');
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await this.userRepository.save(user);
    const link = `${this.configService.get('APP_URL')}/reset-password?token=${resetPasswordToken}`;
    await this.mailService.sendResetPasswordEmail(user.email, link);
    return { message: 'A password reset link has been sent to your email address.' };
  }
 public async getResetPasswordLink(userId: string, resetPasswordToken: string) {
        const user = await this.userRepository.findOneBy( { id: userId });
        if (!user) throw new BadRequestException("invalid link");

        if (user.resetPasswordToken === null ||
           user.resetPasswordToken !== resetPasswordToken||
           !user.resetPasswordTokenExpiry ||
           user.resetPasswordTokenExpiry < new Date())
        {    throw new BadRequestException("invalid link");}

        return { message: 'valid link' }

        
    }

    async resetPassword(dto: ResetPasswordDto) {
      const user =await this.userRepository.findOneBy({ id: dto.userId });
      if (!user) throw new BadRequestException("invalid link");
      if (user.resetPasswordToken === null ||
          user.resetPasswordToken !== dto.resetPasswordToken ||
          !user.resetPasswordTokenExpiry ||
          user.resetPasswordTokenExpiry < new Date())
      {    throw new BadRequestException("invalid link");}

    const hashedPassword = await this.hashPassword(dto.newPassword);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;
    await this.userRepository.save(user);
    return { message: 'Password reset successfully' };
  

    }
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
  private generateLink(userId: string, verificationToken: string) {
    return `${this.configService.get<string>("APP_URL")}/api/users/auth/verify-email/${userId}/${verificationToken}`;
}
  private async generateToken(payload: JwtPayload) {
return this.jwtService.sign(payload);
  }
      }




      

