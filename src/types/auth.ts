import z from "zod";

export const AuthTokenResponseSchema = z.object({
  token: z.string(),
});
