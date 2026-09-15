import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatteryModule } from './battery/battery.module.js';
import { CarModule } from './car/car.module.js';
import { ConditionerModule } from './conditioner/conditioner.module.js';
import { EnginModule } from './engin/engin.module.js';
import { Product } from './products/product.entity.js';
import { ProductsModule } from './products/products.module.js';
import { UsersModule } from './users/users.module.js';
import { ReviewsModule } from './reviews/reviews.module.js';
import { UserEntity } from './users/user.entity.js';
import { Review } from './reviews/review.entity.js';
import { AuthModule } from './auth/auth.module.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './auth/interceptor/logger.interceptor.js';
import { MailModule } from './mail/mail.module.js';


@Module({
  imports: [UsersModule, CarModule, BatteryModule, EnginModule, ConditionerModule,
  
    TypeOrmModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: async (config:ConfigService) => ({
      type:'postgres',
      username:config.get<string>('DB_USERNAME'),
      password:config.get<string>('DB_PASSWORD'),
      database:config.get<string>('DB_NAME'),
      host:config.get<string>('DB_HOST'),
      port:config.get<number>('DB_PORT'),
      autoLoadEntities:true,
      synchronize:true,
      entities:[
        Product,
        UserEntity,
        Review
      ],
    })
      }
    ),
      ConfigModule.forRoot({
        isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ProductsModule,
    ReviewsModule,
    AuthModule,
    MailModule
  ],
  providers:[
    {
      provide:APP_INTERCEPTOR,
      useClass:ClassSerializerInterceptor
      
    },
    {
    provide: APP_INTERCEPTOR,
    useClass: LoggerInterceptor,
  },
  ]
})

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerInterceptor).forRoutes('*');
  }

}