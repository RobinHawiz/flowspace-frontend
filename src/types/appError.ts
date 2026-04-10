import z from "zod";

export const errorSchema = z.object({
  message: z.string(),
});

export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    readonly message: string,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}
