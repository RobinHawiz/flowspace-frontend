import request from "@api/request";
import { type AppUserRegistration } from "@customTypes/appUser";

interface IAppUserApi {
  registerUser(appUser: AppUserRegistration): void;
}

export class AppUserAPI implements IAppUserApi {
  async registerUser(appUser: AppUserRegistration) {
    const options = {
      method: "POST" as const,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appUser),
    };
    await request(`/auth/register`, options);
  }
}
