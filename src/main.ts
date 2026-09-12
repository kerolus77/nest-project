import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
  }))

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
