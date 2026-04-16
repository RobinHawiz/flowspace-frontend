import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getUser, registerUser } from "@api/appUser";
import { getWorkspaces } from "@api/workspace";
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

export function workspacesQueryOptions() {
  return queryOptions({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces(),
    throwOnError: true,
  });
}
