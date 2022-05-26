import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LetterRepository } from 'src/entity/letter/letter.repository';
import { UserRepository } from 'src/entity/user/user.repository';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, LetterRepository]),
    ConfigService,
  ],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
