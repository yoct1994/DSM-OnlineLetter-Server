import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { User } from './entity/user/user.entity';
import { UserModule } from './user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { LetterModule } from './letter/letter.module';
import { Letter } from './entity/letter/letter.entity';
import { LetterImage } from './entity/image/letter/image.letter.entity';
import { LetterUser } from './entity/letter_user/letter-user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        password: configService.get('database.password'),
        username: configService.get('database.user'),
        port: configService.get('database.port'),
        database: configService.get('database.name'),
        synchronize: true,
        entities: [User, Letter, LetterImage, LetterUser],
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
        ttl: 0,
      }),
    }),
    UserModule,
    AuthModule,
    LetterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
