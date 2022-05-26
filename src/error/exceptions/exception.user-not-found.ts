import { CustomException } from "../error.exception";

export class UserNotFoundException extends CustomException {
    constructor() {
        super({
            message: "User not found",
            status: 404,
            timestamp: new Date().toISOString(),
        })
    }
}