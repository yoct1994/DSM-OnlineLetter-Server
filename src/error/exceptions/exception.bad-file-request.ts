import { CustomException } from '../error.exception';

export class BadFileRequestException extends CustomException {
  constructor() {
    super({
      status: 400,
      message: 'File Bad Request',
      timestamp: new Date().toISOString(),
    });
  }
}
