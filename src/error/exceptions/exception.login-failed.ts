import { CustomException } from "../error.exception";

export class LoginFailedExceotion extends CustomException {
    constructor() {
        super({
            message: 'Login Failed',
            status: 403,
            timestamp: new Date().toISOString(),
        })
    }
}