import { CustomException } from "../error.exception";

export class ExpiredTokenException extends CustomException {
    constructor() {
        super({
            message: "Expired Token",
            status: 403,
            timestamp: new Date().toISOString(),
        });
    }
}