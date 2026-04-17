import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { queryClient } from "@src/queryClient";
import { getUser, registerUser } from "@api/appUser";
import {
  createWorkspace,
  getWorkspace,
  getWorkspaces,
  updateWorkspace,
} from "@api/workspace";
import type { AppUserRegistration } from "@customTypes/appUser";
import type {
  WorkspaceCreation,
  WorkspaceResponse,
  WorkspaceUpdate,
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

export function workspaceEditMutationOptions() {
  return mutationOptions({
    mutationFn: (workspace: WorkspaceUpdate) => updateWorkspace(workspace),
    onSuccess: (_data, workspace) => {
      queryClient.setQueryData<Array<WorkspaceResponse>>(
        ["workspaces"],
        (oldData) => {
          return oldData
            ? oldData.map((w) =>
                w.id === workspace.id ? { ...w, ...workspace } : w,
              )
            : oldData;
        },
      );
      queryClient.setQueryData<WorkspaceResponse>(
        ["workspaces", workspace.id],
        (oldData) => {
          return oldData ? { ...oldData, ...workspace } : oldData;
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

export function workspaceQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["workspaces", id],
    queryFn: () => getWorkspace(id),
    throwOnError: true,
  });
}
