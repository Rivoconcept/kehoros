import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { FormsModule } from './forms/forms.module';

function parseDatabaseUrl(url: string) {
  const u = new URL(url.replace('?schema=public', ''));
  return {
    host: u.hostname,
    port: parseInt(u.port) || 5432,
    username: u.username,
    password: u.password,
    database: u.pathname.replace('/', ''),
  };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        ...parseDatabaseUrl(process.env.DATABASE_URL!),
        schema: 'public',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    UserModule,
    PropertyModule,
    AuthModule,
    FormsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}