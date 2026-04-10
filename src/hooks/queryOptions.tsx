import { mutationOptions } from "@tanstack/react-query";
import { AppUserAPI } from "@api/appUser";
import type { AppUserRegistration } from "@customTypes/appUser";

const appUserApi = new AppUserAPI();

export function appUserRegisterMutationOptions() {
  return mutationOptions({
    mutationFn: (appUser: AppUserRegistration) =>
      appUserApi.registerUser(appUser),
  });
}
