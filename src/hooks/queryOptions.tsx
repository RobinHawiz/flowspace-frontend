import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { queryClient } from "@src/queryClient";
import { getUser, registerUser } from "@api/appUser";
import {
  addWorkspaceMember,
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  getWorkspaceMembers,
  getWorkspaces,
  removeWorkspaceMember,
  updateWorkspace,
} from "@api/workspace";
import type { AppUserRegistration } from "@customTypes/appUser";
import type {
  WorkspaceCreation,
  WorkspaceMembersAdd,
  WorkspaceMembersRemove,
  WorkspaceMembersResponse,
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

export function workspaceDeleteMutationOptions() {
  return mutationOptions({
    mutationFn: (workspaceId: number) => deleteWorkspace(workspaceId),
    onSuccess: (_data, workspaceId) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId] });
      queryClient.setQueryData<Array<WorkspaceResponse>>(
        ["workspaces"],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((w) => w.id !== workspaceId);
        },
      );
    },
  });
}

export function workspaceMembersAddMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: WorkspaceMembersAdd) => addWorkspaceMember(payload),
    onSuccess: (workspaceMember, payload) => {
      queryClient.setQueryData<Array<WorkspaceMembersResponse>>(
        ["workspaces", "members", payload.id],
        (oldData) => {
          return oldData ? [...oldData, workspaceMember] : [workspaceMember];
        },
      );
    },
  });
}

export function workspaceMembersRemoveMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: WorkspaceMembersRemove) =>
      removeWorkspaceMember(payload),
    onSuccess: (_data, payload) => {
      queryClient.setQueryData<Array<WorkspaceMembersResponse>>(
        ["workspaces", "members", payload.workspaceId],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((m) => m.id !== payload.appUserId);
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

export function workspaceMembersQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["workspaces", "members", id],
    queryFn: () => getWorkspaceMembers(id),
    throwOnError: true,
  });
}
