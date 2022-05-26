import { CustomException } from "../error.exception";

export class AlreadySignUpException extends CustomException {
    constructor() {
        super({
            status: 403,
            message: "User Already Sign Up",
            timestamp: new Date().toISOString(),
        });
    }
}