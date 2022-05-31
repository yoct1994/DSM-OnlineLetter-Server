import { CustomException } from '../error.exception';

export class ServerErrorException extends CustomException {
  constructor() {
    super({
      status: 500,
      message: 'Server Error',
      timestamp: new Date().toISOString(),
    });
  }
}
