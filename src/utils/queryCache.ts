import { queryClient } from "@src/queryClient";
import type {
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

export function removeWorkspaceFromCache(workspaceId: number) {
  queryClient.invalidateQueries({ queryKey: ["workspaces", workspaceId] });
  queryClient.setQueryData<Array<WorkspaceResponse>>(
    ["workspaces"],
    (oldData) => {
      if (!oldData) return oldData;
      return oldData.filter((w) => w.id !== workspaceId);
    },
  );
}
