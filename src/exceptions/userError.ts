import { AppError } from "@/exceptions/appError";

export class UserError extends AppError {
    status: number
    constructor(public message: string, status: number = 417) {
        super(message)
        this.status = status
    }

    static userNotFound() {
        return new UserError("User not found", 404)
    }
}
