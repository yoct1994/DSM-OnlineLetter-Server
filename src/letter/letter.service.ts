import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Letter as LetterRes,
  LetterResponse,
  Sentence,
  VerifyToken,
  WriteLetterRequest,
} from 'src/data/Data';
import { LetterImageRepository } from 'src/entity/image/letter/image.letter.repository';
import { Letter } from 'src/entity/letter/letter.entity';
import { LetterRepository } from 'src/entity/letter/letter.repository';
import { LetterUser } from 'src/entity/letter_user/letter-user.entity';
import { LetterUserRepository } from 'src/entity/letter_user/letter-user.repository';
import { User } from 'src/entity/user/user.entity';
import { UserRepository } from 'src/entity/user/user.repository';
import { LetterNotFoundException } from 'src/error/exceptions/exception.letter-not-found';
import { ServerErrorException } from 'src/error/exceptions/exception.server-error';
import { UserNotFoundException } from 'src/error/exceptions/exception.user-not-found';
import { Connection, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class LetterService {
  constructor(
    private readonly letterRepository: LetterRepository,
    private readonly userRepository: UserRepository,
    private readonly letterImageRepository: LetterImageRepository,
    private readonly letterUserRepository: LetterUserRepository,
    private configService: ConfigService,
    private connection: Connection,
  ) {}

  async writeLetter(
    files: Express.Multer.File[],
    writeLetterRequest: WriteLetterRequest,
    verifyToken: VerifyToken,
  ) {
    const user = await this.userRepository.findOne({
      userSeq: verifyToken.userSeq,
    });

    const to = await this.userRepository.findOne({
      userSeq: writeLetterRequest.to,
    });

    if (!user || !to) {
      throw new UserNotFoundException();
    }

    var chatJson = '';

    if (writeLetterRequest.chatList !== '') {
      const chatList = (await JSON.parse(
        writeLetterRequest.chatList,
      )) as Sentence[];

      console.log(chatList);

      var idx = 0;
      chatList.forEach((chat, index) => {
        if (chat.image !== '') {
          chatList[
            index
          ].image = `http://localhost:8080/user/image/${files[idx].filename}`;
        }
      });

      chatJson = JSON.stringify(chatList);
    }
    console.log(Date.now());

    var dist: number = (dist = this.getDistance(
      user.latitude,
      user.longitude,
      to.latitude,
      to.longitude,
    ));
    var send = Math.ceil(dist / 10);

    console.log(Date.now() + send);

    const users = (await this.letterUserRepository.save([
      {
        userSeq: user,
        fromOrTo: 'from',
      },
      {
        userSeq: to,
        fromOrTo: 'to',
      },
    ])) as LetterUser[];

    console.log(new Date(Date.now() + send));

    const letter = await this.letterRepository
      .save({
        title: writeLetterRequest.title,
        chatList: chatJson,
        isRead: false,
        letterUsers: users,
        writeAt: Date.now(),
        sendAt: Date.now() + send,
      })
      .catch((err) => {
        console.log(err);
        throw new ServerErrorException();
      });

    files.forEach(async (file) => {
      await this.letterImageRepository
        .save({
          letter: letter,
          imageName: file.filename,
        })
        .catch((err) => {
          console.log(err);
          throw new ServerErrorException();
        });
    });
  }

  getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    if (lat1 == lat2 && lon1 == lon2) return 0;

    var radLat1 = (Math.PI * lat1) / 180;
    var radLat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radTheta = (Math.PI * theta) / 180;
    var dist: number =
      Math.sin(radLat1) * Math.sin(radLat2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1) dist = 1;

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100) dist = Math.round(dist / 10) * 10;
    else dist = Math.round(dist / 100) * 100;

    return dist;
  }

  async getLetter(
    letterSeq: number,
    verifyToken: VerifyToken,
  ): Promise<LetterResponse> {
    const user = await this.userRepository.findOne({
      userSeq: verifyToken.userSeq,
    });

    const letter = await this.connection
      .getRepository(Letter)
      .createQueryBuilder('letters')
      .leftJoin('letters.letterUsers', 'u')
      .leftJoinAndSelect('letters.letterUsers', 'users')
      .leftJoinAndSelect('users.userSeq', 'userSeq')
      .where('u.userSeq.userSeq = :userSeq or letters.id = :letterSeq', {
        userSeq: user.userSeq,
        letterSeq: letterSeq,
      })
      .getOne();

    console.log(letter);

    if (!letter) {
      throw new LetterNotFoundException();
    }

    return {
      chatList: letter.chatList !== undefined ? letter.chatList : '',
    };
  }

  async getMyLetters(verifyToken: VerifyToken) {
    const user = await this.userRepository
      .findOne({
        userSeq: verifyToken.userSeq,
      })
      .catch((err) => {
        throw new UserNotFoundException();
      });

    if (!user) {
      throw new UserNotFoundException();
    }

    return await this.getLetterRes(user);
  }

  async getSomeOneLetters(verifyToken: VerifyToken, userSeq: number) {
    const user = await this.userRepository.findOne({
      userSeq: verifyToken.userSeq,
    });
    const someone = await this.userRepository.findOne({ userSeq: userSeq });

    if (!user || !someone) {
      throw new UserNotFoundException();
    }

    return await this.getLetterRes(someone);
  }

  private async getLetterRes(user: User) {
    const letters = await this.connection
      .getRepository(Letter)
      .createQueryBuilder('letters')
      .leftJoin('letters.letterUsers', 'u')
      .leftJoinAndSelect('letters.letterUsers', 'users')
      .leftJoinAndSelect('users.userSeq', 'userSeq')
      .where('u.userSeq.userSeq = :userSeq and letters.sendAt <= :now', {
        userSeq: user.userSeq,
        now: Date.now(),
      })
      .getMany();

    var letterResponse: LetterRes[] = [];

    letters.forEach((letter) => {
      let fromIdx = letter.letterUsers[0].fromOrTo === 'from' ? 0 : 1;
      let toIdx = letter.letterUsers[0].fromOrTo === 'to' ? 0 : 1;

      letterResponse.push({
        id: letter.id,
        from: letter.letterUsers[fromIdx].userSeq.name,
        to: letter.letterUsers[toIdx].userSeq.name,
        isRead: letter.isRead,
        toSeq: letter.letterUsers[toIdx].userSeq.userSeq,
        fromSeq: letter.letterUsers[fromIdx].userSeq.userSeq,
      });
    });

    return letterResponse;
  }
}
