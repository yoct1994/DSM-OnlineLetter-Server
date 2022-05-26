import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { BadFileRequestException } from 'src/error/exceptions/exception.bad-file-request';

export const MulterConfig: MulterOptions = {
  fileFilter: (request, file, callback) => {
    console.log(file);
    if (file.mimetype.match(/\/(jpg|jpeg|png|JPG|PNG|JPEG)$/)) {
      callback(null, true);
    } else {
      callback(new BadFileRequestException(), false);
    }
  },
  storage: diskStorage({
    destination: (request, file, callback) => {
      const filePath = 'file';
      if (!existsSync(filePath)) {
        mkdirSync(filePath);
      }
      callback(null, filePath);
    },
    filename: (request, file, callback) => {
      const ext = file.mimetype.split('/');
      const filename = `${randomUUID()}.${ext[ext.length - 1]}`;
      callback(null, filename);
    },
  }),
};
