import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { queryClient } from "@src/queryClient";
import { getUser, registerUser } from "@api/appUser";
import { createWorkspace, getWorkspaces } from "@api/workspace";
import type { AppUserRegistration } from "@customTypes/appUser";
import type {
  WorkspaceCreation,
  WorkspaceResponse,
} from "@customTypes/workspace";

export function appUserRegisterMutationOptions() {
  return mutationOptions({
    mutationFn: (appUser: AppUserRegistration) => registerUser(appUser),
  });
}

export function workspaceCreationMutationOptions() {
  return mutationOptions({
    mutationFn: (workspace: WorkspaceCreation) => createWorkspace(workspace),
    onSuccess: (workspace) => {
      queryClient.setQueryData<Array<WorkspaceResponse>>(
        ["workspaces"],
        (oldData) => {
          // Update the cached data with the new workspace.
          return oldData ? [...oldData, workspace] : [workspace];
        },
      );
    },
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
