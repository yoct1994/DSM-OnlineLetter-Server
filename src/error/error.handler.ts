import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { CustomException } from "./error.exception";

@Catch(CustomException)
export class HttpExceptionHandler implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        console.error(`에러 발생 : ${exception}`);

        const status = 
            exception instanceof HttpException ?
            exception.getStatus() :
            HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException ?
         exception.getResponse() :
         "Internal Server Error";

        response
            .status(status)
            .json({
                status: status,
                message: message,
                timstamp: new Date().toISOString(),
                path: request.path,
            });
    }
}