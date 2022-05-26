import { HttpException, HttpStatus } from "@nestjs/common";
import { Error } from "src/data/Data";

export class CustomException extends HttpException {
    constructor(error: Error) {
        super(error.message, error.status);
        this.error = error;
    }

    error: Error;
}