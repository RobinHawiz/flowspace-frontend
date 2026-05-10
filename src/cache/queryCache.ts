import { queryClient } from "@src/cache/queryClient";
import type {
  WorkspaceMembersResponse,
  WorkspaceResponse,
  WorkspaceUpdate,
} from "@customTypes/workspace";

export function addWorkspaceToCache(workspace: WorkspaceResponse) {
  queryClient.setQueryData<Array<WorkspaceResponse>>(
    ["workspaces"],
    (oldData) => {
      return oldData ? [...oldData, workspace] : [workspace];
    },
  );
}

export function updateWorkspaceInCache(workspace: WorkspaceUpdate) {
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
}

export function removeWorkspaceFromCache(workspaceId: string) {
  queryClient.removeQueries({ queryKey: ["workspaces", workspaceId] });
  queryClient.setQueryData<Array<WorkspaceResponse>>(
    ["workspaces"],
    (oldData) => {
      if (!oldData) return oldData;
      return oldData.filter((w) => w.id !== workspaceId);
    },
  );
}

export function addWorkspaceMemberToCache(
  workspaceMember: WorkspaceMembersResponse,
  workspaceId: string,
) {
  queryClient.setQueryData<Array<WorkspaceMembersResponse>>(
    ["members", workspaceId],
    (oldData) => {
      return oldData ? [...oldData, workspaceMember] : [workspaceMember];
    },
  );
}

export function removeWorkspaceMemberFromCache(
  workspaceId: string,
  appUserId: string,
) {
  queryClient.setQueryData<Array<WorkspaceMembersResponse>>(
    ["members", workspaceId],
    (oldData) => {
      if (!oldData) return oldData;
      return oldData.filter((m) => m.id !== appUserId);
    },
  );
}
