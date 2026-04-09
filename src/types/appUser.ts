import z from "zod";

// Payload for app user registration.
export type AppUserRegistration = z.infer<typeof appUserRegistrationSchema>;

export const appUserRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name must be between 1 and 50 characters.")
    .max(50, "First name must be between 1 and 50 characters."),
  lastName: z
    .string()
    .min(1, "Last name must be between 1 and 50 characters.")
    .max(50, "Last name must be between 1 and 50 characters."),
  email: z.email("Email has to be written in a valid format."),
  password: z
    .string()
    .min(8, "Password must be between 8 and 200 characters.")
    .max(200, "Password must be between 8 and 200 characters.")
    .regex(/^\S+$/, "Password cannot contain spaces."),
});
