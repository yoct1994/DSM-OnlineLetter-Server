import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sentence, VerifyToken, WriteLetterRequest } from 'src/data/Data';
import { LetterRepository } from 'src/entity/letter/letter.repository';
import { UserRepository } from 'src/entity/user/user.repository';
import { UserNotFoundException } from 'src/error/exceptions/exception.user-not-found';

@Injectable()
export class LetterService {
  constructor(
    private readonly letterRepository: LetterRepository,
    private readonly userRepository: UserRepository,
    private configService: ConfigService,
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

    const chatList = (await JSON.parse(
      writeLetterRequest.chatList,
    )) as Sentence[];

    var idx = 0;
    chatList.forEach((chat, index) => {
      if (chat.image !== '') {
        chatList[index].image = `http://${this.configService.get(
          'image.url',
        )}/user/image/${files[idx].filename}`;
      }
    });

    const chatJson = JSON.stringify(chatList);

    this.letterRepository.save({
      title: writeLetterRequest.title,
      to: to,
      from: user,
      chatList: chatJson,
      isRead: false,
      writeAt: Date.now(),
    });
  }
}
