import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtAuthGuard from 'src/auth/jwt/jwt-auth.guard';
import { Token } from 'src/auth/jwt/token.decorator';
import { VerifyToken, WriteLetterRequest } from 'src/data/Data';
import { MulterConfig } from 'src/utils/multer.option';
import { LetterService } from './letter.service';

@Controller('letter')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post()
  @UseInterceptors(FileInterceptor('images', MulterConfig))
  @UseGuards(JwtAuthGuard)
  writeLetter(
    @UploadedFiles() images: Express.Multer.File[],
    @Body() writeLetterRequest: WriteLetterRequest,
    @Token() verifyToken: VerifyToken,
  ) {
    return this.letterService.writeLetter(
      images,
      writeLetterRequest,
      verifyToken,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyLetters() {}

  @Get('/:userSeq')
  @UseGuards(JwtAuthGuard)
  getSomeOneLetters(@Param('userSeq') userSeq: number) {}
}
