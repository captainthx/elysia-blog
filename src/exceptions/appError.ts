export abstract class AppError extends Error {
  abstract status: number;

  constructor(public message: string) {
    super(message);
  }

  toResponse() {
    return Response.json(
      {
        error: this.message,
        code: this.status,
      },
      {
        status: this.status,
      }
    );
  }
}
