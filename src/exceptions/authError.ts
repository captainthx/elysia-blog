import { AppError } from "./appError";

export class AuthError extends AppError {
    status = 401
	constructor(public message: string) {
		super(message)
	}
}