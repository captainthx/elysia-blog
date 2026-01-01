import { AppError } from "@/exceptions/appError"

export class AuthError extends AppError {

	status = 401

	constructor(public message: string) {
		super(message)
	}

	static invalidCredentials() {
		return new AuthError("invalid credentials")
	}

	static userNotFound() {
		return new AuthError("User not found")
	}

	static duplicateUser() {
		return new AuthError("User already exists")
	}

	static invalidToken() {
		return new AuthError("Invalid token")
	}
}