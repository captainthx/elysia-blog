import { AppError } from "@/exceptions/appError";

export class BlogError extends AppError {
    status: number
    constructor(public message: string, status: number = 417) {
        super(message)
        this.status = status
    }

    static blogNotFound() {
        return new BlogError("Blog not found", 404)
    }
}
