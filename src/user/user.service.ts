import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  StreamableFile,
  UseFilters,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { randomUUID, sign } from 'crypto';
import { Response } from 'express';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { SignUpRequest, UserResponse, VerifyToken } from 'src/data/Data';
import { UserRepository } from 'src/entity/user/user.repository';
import { HttpExceptionHandler } from 'src/error/error.handler';
import { AlreadySignUpException } from 'src/error/exceptions/exception.already-signup';
import { BadFileRequestException } from 'src/error/exceptions/exception.bad-file-request';
import { UserNotFoundException } from 'src/error/exceptions/exception.user-not-found';
import { hash } from 'src/utils/password.encoder';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  async signUp(signUpRequest: SignUpRequest, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ id: signUpRequest.id });
    if (!file) {
      return new BadFileRequestException();
    }

    console.log(user);
    if (user) {
      console.error('실패');
      throw new AlreadySignUpException();
    } else {
      await this.userRepository
        .save({
          id: signUpRequest.id,
          password: hash(signUpRequest.password),
          name: signUpRequest.username,
          userImage: `http://localhost:8080/${file.filename}`,
          longitude: signUpRequest.longitude,
          latitude: signUpRequest.latitude,
        })
        .catch((err) => {
          console.log(err);
          throw new BadFileRequestException();
        });
    }
  }

  getImage(filename: string, res: Response) {
    const uploadFilePath = 'file';

    if (!existsSync(uploadFilePath)) {
      mkdirSync(uploadFilePath);
    }

    const filePath = __dirname + `/../../file/${filename}`;
    const image = readFileSync(filePath);

    console.log(image, 'utf8');
    const ex = filename.split('.');
    console.log(ex[ex.length - 1]);
    res.set({ 'Content-Type': `image/${ex[ex.length - 1]}` });

    return new StreamableFile(image, {});
  }

  async getMyInfo(verifyToken: VerifyToken): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      userSeq: verifyToken.userSeq,
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    return {
      userSeq: user.userSeq,
      username: user.name,
      userImage: user.userImage,
      longitude: user.longitude,
      latitude: user.latitude,
    };
  }
}
