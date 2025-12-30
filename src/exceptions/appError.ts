export abstract class AppError extends Error {
  abstract status: number;

  constructor(public message: string) {
    super(message);
  }

  toResponse() {
    return {
      error: this.message,
      code: this.status,
    };
  }
}
