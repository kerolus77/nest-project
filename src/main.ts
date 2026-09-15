import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
import { AppModule } from './app.module.js';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(process.cwd(), 'uploads'));
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
  }))
app.use(helmet());
   // Swagger
  const swagger = new DocumentBuilder()
  .setTitle("Nest JS project - App API")
  .setDescription("Your API description")
  .addServer("http://localhost:3000")
  .setTermsOfService("http://localhost:3000/terms-of-service")
  .setLicense("MIT License", "https://google.com")
  .setVersion("1.0")
  .addSecurity('bearer', { type: 'http', scheme: 'bearer' })
  .addBearerAuth()
  .build();
  const documentation = SwaggerModule.createDocument(app,  swagger);
  // http://localhost:3000/swagger
  SwaggerModule.setup("swagger", app, documentation);
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();


