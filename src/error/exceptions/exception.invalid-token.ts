import { CustomException } from "../error.exception";

export class InvalidTokenException extends CustomException {
    constructor() {
        super({
            message: "Invalid token",
            status: 403,
            timestamp: new Date().toISOString(),
        })
    }
}