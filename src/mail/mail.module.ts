import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service.js';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

@Module({
  
  imports: [

    MailerModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('EMAIL_HOST') ?? 'localhost',
          port: config.get<number>('EMAIL_PORT') ?? 587,
          secure: false,
          auth: {
            user: config.get<string>('EMAIL_USER') ?? '',
            pass: config.get<string>('EMAIL_PASS') ?? '',
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}