import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VaultBootstrap } from './vault/vault.bootstrap';
import { ValidationPipe } from '@nestjs/common';


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
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: http://localhost:3000`);

}
bootstrap();
