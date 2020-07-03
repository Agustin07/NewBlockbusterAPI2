import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from './movies/movies.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppMailerService } from './appmailer.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: 'smtps://lm10001dev@gmail.com:rayohielo@smtp.gmail.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'blockbusterdb',
      synchronize: true,
      autoLoadEntities: true,
    }),
    MoviesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppMailerService],
  exports: [AppMailerService],
})
export class AppModule {}
