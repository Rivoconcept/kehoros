import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VaultBootstrap } from './vault/vault.bootstrap';


async function bootstrap() {
    
  // Charge les secrets AVANT de créer l'app Nest
  await VaultBootstrap.loadSecrets();

  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://frontend.localhost',
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: http://localhost:3000`);

}
bootstrap();
