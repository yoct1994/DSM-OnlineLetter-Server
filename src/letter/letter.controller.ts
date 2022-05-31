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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import JwtAuthGuard from 'src/auth/jwt/jwt-auth.guard';
import { Token } from 'src/auth/jwt/token.decorator';
import { VerifyToken, WriteLetterRequest } from 'src/data/Data';
import { MulterConfig } from 'src/utils/multer.option';
import { LetterService } from './letter.service';

@Controller('letter')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post('/write')
  @UseInterceptors(FilesInterceptor('images', null, MulterConfig))
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

  @Get('detail/:letterSeq')
  @UseGuards(JwtAuthGuard)
  getLetter(
    @Param('letterSeq') letterSeq: number,
    @Token() verifyToken: VerifyToken,
  ) {
    return this.letterService.getLetter(letterSeq, verifyToken);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyLetters(@Token() verifyToken: VerifyToken) {
    return this.letterService.getMyLetters(verifyToken);
  }

  @Get('someone/:userSeq')
  @UseGuards(JwtAuthGuard)
  getSomeOneLetters(
    @Param('userSeq') userSeq: number,
    @Token() verifyToken: VerifyToken,
  ) {
    return this.letterService.getSomeOneLetters(verifyToken, userSeq);
  }
}
