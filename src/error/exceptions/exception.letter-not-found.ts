import { CustomException } from '../error.exception';

export class LetterNotFoundException extends CustomException {
  constructor() {
    super({
      message: 'Letter Not Found',
      status: 404,
      timestamp: new Date().toISOString(),
    });
  }
}
