import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequest, UserResponse, VerifyToken } from 'src/data/Data';
import JwtAuthGuard from 'src/auth/jwt/jwt-auth.guard';
import { Token } from 'src/auth/jwt/token.decorator';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterConfig } from 'src/utils/multer.option';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', MulterConfig))
  signUp(
    @UploadedFile() file: Express.Multer.File,
    @Body() signUpRequest: SignUpRequest,
  ) {
    // console.log(signUpRequest);
    console.log(file);
    return this.userService.signUp(signUpRequest, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getInfo(@Token() verifyToken: VerifyToken) {
    return this.userService.getMyInfo(verifyToken);
  }

  @Get('/image/:filename')
  getUserImage(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(filename);
    return this.userService.getImage(filename, res);
  }
}
