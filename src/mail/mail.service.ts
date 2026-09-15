import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, RequestTimeoutException } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendLoginEmail(email: string,): Promise<void> {
      try {
        const today = new Date();
      await   this.mailerService.sendMail({
          to: email,
          subject: 'Login Notification',
          template: 'login',
          context: { email, today },
        });
      } catch (error) {
        console.error('Error sending login email:', error);
        throw new RequestTimeoutException();
      }
    }

    async sendVerificationEmail(email: string,link: string): Promise<void> {
      try {
        
     await   this.mailerService.sendMail({
          to: email,
          subject: 'Email Verification',
          template: 'email-verification',
          context: { email, link },
        });
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw new RequestTimeoutException();
      }
    }

   async sendResetPasswordEmail(email: string, link: string): Promise<void> {
     try {
        
     await   this.mailerService.sendMail({
          to: email,
          subject: 'Reset Password',
          template: 'reset-password',
          context: { link },
        });
      } catch (error) {
        console.error('Error sending reset password email:', error);
        throw new RequestTimeoutException();
      }
    }
}
