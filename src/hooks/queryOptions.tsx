import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getUser, registerUser } from "@api/appUser";
import type { AppUserRegistration } from "@customTypes/appUser";

export function appUserRegisterMutationOptions() {
  return mutationOptions({
    mutationFn: (appUser: AppUserRegistration) => registerUser(appUser),
  });
}

export function appUserQueryOptions() {
  return queryOptions({
    queryKey: ["currentAppUser"],
    queryFn: () => getUser(),
    throwOnError: true,
  });
}
