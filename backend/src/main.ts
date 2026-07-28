import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VaultBootstrap } from './vault/vault.bootstrap';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
    
  // Charge les secrets AVANT de créer l'app Nest
  await VaultBootstrap.loadSecrets();
  // console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  app.enableCors({
    origin: [
      'http://frontend.localhost',
      'http://frontend.localhost:4200',
      'http://localhost:4200',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Kehoros API')
    .setDescription('API du moteur de formulaires Kehoros')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('templates')
    .addTag('questions')
    .addTag('options')
    .addTag('assignments')
    .addTag('responses')
    .addTag('results')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger API docs available at: http://localhost:3000/api`);


}
bootstrap();
