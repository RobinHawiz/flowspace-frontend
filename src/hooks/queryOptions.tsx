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
import {
  addWorkspaceColumn,
  deleteWorkspaceColumn,
  getWorkspaceColumns,
  updateWorkspaceColumnOrder,
  updateWorkspaceColumnTitle,
} from "@api/workspaceColumn";
import type {
  WorkspaceColumnCreation,
  WorkspaceColumnDeletion,
  WorkspaceColumnOrderUpdate,
  WorkspaceColumnResponse,
  WorkspaceColumnTitleUpdate,
} from "@customTypes/workspaceColumn";
import {
  addTask,
  getTasks,
  moveTaskToDifferentColumn,
  updateTask,
  updateTaskOrder,
} from "@api/task";
import type {
  MoveTaskToDifferentColumn,
  TaskCreation,
  TaskOrderUpdate,
  TaskResponse,
  TaskUpdate,
} from "@customTypes/task";

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
        ["members", payload.workspaceId],
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
        ["members", payload.workspaceId],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.filter((m) => m.id !== payload.appUserId);
        },
      );
    },
  });
}

export function workspaceColumnOrderUpdateMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: WorkspaceColumnOrderUpdate) =>
      updateWorkspaceColumnOrder(payload),
    onMutate: (payload, context) => {
      const previousColumns = context.client.getQueryData<
        Array<WorkspaceColumnResponse>
      >(["columns", payload.workspaceId]);

      context.client.setQueryData<Array<WorkspaceColumnResponse>>(
        ["columns", payload.workspaceId],
        (oldData) => {
          const columnOrderDifference =
            payload.workspaceColumnOrderNew -
            payload.workspaceColumnOrderCurrent;
          if (columnOrderDifference === 0) return oldData; // No change in order, no need to update.
          if (columnOrderDifference > 0) {
            // If the column was moved to the right, we need to decrement the order of the subsequent columns that were between the old and new position.
            return oldData
              ? oldData
                  .map((wc) => {
                    if (wc.id === payload.workspaceColumnId) {
                      return {
                        ...wc,
                        workspaceColumnOrder: payload.workspaceColumnOrderNew,
                      };
                    }
                    if (
                      wc.workspaceColumnOrder >
                        payload.workspaceColumnOrderCurrent &&
                      wc.workspaceColumnOrder <= payload.workspaceColumnOrderNew
                    ) {
                      return {
                        ...wc,
                        workspaceColumnOrder: wc.workspaceColumnOrder - 1,
                      };
                    }
                    return wc;
                  })
                  .sort(
                    (a, b) => a.workspaceColumnOrder - b.workspaceColumnOrder,
                  )
              : oldData;
          } else {
            // If the column was moved to the left, we need to increment the order of the preceding columns that were between the old and new position.
            return oldData
              ? oldData
                  .map((wc) => {
                    if (wc.id === payload.workspaceColumnId) {
                      return {
                        ...wc,
                        workspaceColumnOrder: payload.workspaceColumnOrderNew,
                      };
                    }
                    if (
                      wc.workspaceColumnOrder <
                        payload.workspaceColumnOrderCurrent &&
                      wc.workspaceColumnOrder >= payload.workspaceColumnOrderNew
                    ) {
                      return {
                        ...wc,
                        workspaceColumnOrder: wc.workspaceColumnOrder + 1,
                      };
                    }
                    return wc;
                  })
                  .sort(
                    (a, b) => a.workspaceColumnOrder - b.workspaceColumnOrder,
                  )
              : oldData;
          }
        },
      );
      return { previousColumns };
    },
    // If the mutation fails, use the result returned from onMutate to roll back
    onError: (_err, payload, onMutateResult, context) => {
      context.client.setQueryData(
        ["columns", payload.workspaceId],
        onMutateResult?.previousColumns,
      );
    },
  });
}

export function workspaceColumnUpdateTitleMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: WorkspaceColumnTitleUpdate) =>
      updateWorkspaceColumnTitle(payload),
    onSuccess: (_data, payload) => {
      queryClient.setQueryData<Array<WorkspaceColumnResponse>>(
        ["columns", payload.workspaceId],
        (oldData) => {
          return oldData
            ? oldData.map((w) =>
                w.id === payload.workspaceColumnId
                  ? { ...w, title: payload.title }
                  : w,
              )
            : oldData;
        },
      );
    },
  });
}

export function workspaceColumnDeleteMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: WorkspaceColumnDeletion) =>
      deleteWorkspaceColumn(payload),
    onSuccess: (_data, payload) => {
      queryClient.setQueryData<Array<WorkspaceColumnResponse>>(
        ["columns", payload.workspaceId],
        (oldData) => {
          if (!oldData) return oldData;
          return oldData
            .filter((w) => w.id !== payload.workspaceColumnId) // Remove the deleted column
            .map((w, index) => ({ ...w, workspaceColumnOrder: index })); // Reorder remaining columns
        },
      );
    },
  });
}

export function workspaceColumnAddMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: WorkspaceColumnCreation) =>
      addWorkspaceColumn(payload),
    onSuccess: (workspaceColumn, payload) => {
      queryClient.setQueryData<Array<WorkspaceColumnResponse>>(
        ["columns", payload.workspaceId],
        (oldData) => {
          return oldData ? [...oldData, workspaceColumn] : [workspaceColumn];
        },
      );
    },
  });
}

export function taskOrderUpdateMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: TaskOrderUpdate) => updateTaskOrder(payload),
    onMutate: (payload, context) => {
      const previousTasks = context.client.getQueryData<Array<TaskResponse>>([
        "tasks",
        payload.workspaceId,
      ]);

      context.client.setQueryData<Array<TaskResponse>>(
        ["tasks", payload.workspaceId],
        (oldData) => {
          const taskOrderDifference =
            payload.newTaskOrder - payload.currentTaskOrder;
          if (taskOrderDifference === 0) return oldData; // No change in order, no need to update.
          if (taskOrderDifference > 0) {
            // If the task was moved to a higher order, we need to decrement the order of the subsequent tasks that were between the old and new position.
            return oldData
              ? oldData
                  .map((task) => {
                    if (task.id === payload.taskId) {
                      return {
                        ...task,
                        taskOrder: payload.newTaskOrder,
                      };
                    }
                    if (
                      task.taskOrder > payload.currentTaskOrder &&
                      task.taskOrder <= payload.newTaskOrder &&
                      task.workspaceColumnId === payload.workspaceColumnId
                    ) {
                      return {
                        ...task,
                        taskOrder: task.taskOrder - 1,
                      };
                    }
                    return task;
                  })
                  .sort((a, b) => a.taskOrder - b.taskOrder)
              : oldData;
          } else {
            // If the task was moved to a lower order, we need to increment the order of the preceding tasks that were between the old and new position.
            return oldData
              ? oldData
                  .map((task) => {
                    if (task.id === payload.taskId) {
                      return {
                        ...task,
                        taskOrder: payload.newTaskOrder,
                      };
                    }
                    if (
                      task.taskOrder < payload.currentTaskOrder &&
                      task.taskOrder >= payload.newTaskOrder &&
                      task.workspaceColumnId === payload.workspaceColumnId
                    ) {
                      return {
                        ...task,
                        taskOrder: task.taskOrder + 1,
                      };
                    }
                    return task;
                  })
                  .sort((a, b) => a.taskOrder - b.taskOrder)
              : oldData;
          }
        },
      );
      return { previousTasks };
    },
    // If the mutation fails, use the result returned from onMutate to roll back
    onError: (_err, payload, onMutateResult, context) => {
      context.client.setQueryData(
        ["tasks", payload.workspaceId],
        onMutateResult?.previousTasks,
      );
    },
  });
}

export function moveTaskToDifferentColumnMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: MoveTaskToDifferentColumn) =>
      moveTaskToDifferentColumn(payload),
    onMutate: (payload, context) => {
      const previousTasks = context.client.getQueryData<Array<TaskResponse>>([
        "tasks",
        payload.workspaceId,
      ]);

      context.client.setQueryData<Array<TaskResponse>>(
        ["tasks", payload.workspaceId],
        (oldData) => {
          return oldData
            ? oldData
                .map((task) => {
                  // Reindex the tasks in the previous workspace column.
                  if (
                    task.workspaceColumnId === payload.prevWorkspaceColumnId &&
                    task.taskOrder > payload.prevTaskOrder
                  ) {
                    return { ...task, taskOrder: task.taskOrder - 1 };
                  }
                  // Reindex the tasks in the new workspace column.
                  else if (
                    task.workspaceColumnId === payload.newWorkspaceColumnId &&
                    task.taskOrder >= payload.newTaskOrder
                  ) {
                    return { ...task, taskOrder: task.taskOrder + 1 };
                  }
                  // Update the moved task with the new workspace column and order.
                  else if (task.id === payload.taskId) {
                    return {
                      ...task,
                      workspaceColumnId: payload.newWorkspaceColumnId,
                      taskOrder: payload.newTaskOrder,
                    };
                  }
                  return task;
                })
                .sort((a, b) => a.taskOrder - b.taskOrder)
            : oldData;
        },
      );
      return { previousTasks };
    },
    // If the mutation fails, use the result returned from onMutate to roll back
    onError: (_err, payload, onMutateResult, context) => {
      context.client.setQueryData(
        ["tasks", payload.workspaceId],
        onMutateResult?.previousTasks,
      );
    },
  });
}

export function taskAddMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: TaskCreation) => addTask(payload),
    onSuccess: (task, payload) => {
      queryClient.setQueryData<Array<TaskResponse>>(
        ["tasks", payload.workspaceId],
        (oldData) => {
          return oldData ? [...oldData, task] : [task];
        },
      );
    },
  });
}

export function taskUpdateMutationOptions() {
  return mutationOptions({
    mutationFn: (payload: TaskUpdate) => updateTask(payload),
    onSuccess: (_data, payload) => {
      const { taskId, title, description, priority, deadline } = payload;
      queryClient.setQueryData<Array<TaskResponse>>(
        ["tasks", payload.workspaceId],
        (oldData) => {
          return oldData
            ? oldData.map((t) =>
                t.id === taskId
                  ? { ...t, title, description, priority, deadline }
                  : t,
              )
            : oldData;
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

export function workspaceQueryOptions(workspaceId: number) {
  return queryOptions({
    queryKey: ["workspaces", workspaceId],
    queryFn: () => getWorkspace(workspaceId),
    throwOnError: true,
  });
}

export function workspaceMembersQueryOptions(workspaceId: number) {
  return queryOptions({
    queryKey: ["members", workspaceId],
    queryFn: () => getWorkspaceMembers(workspaceId),
    throwOnError: true,
  });
}

export function workspaceColumnsQueryOptions(workspaceId: number) {
  return queryOptions({
    queryKey: ["columns", workspaceId],
    queryFn: () => getWorkspaceColumns(workspaceId),
    throwOnError: true,
  });
}

export function tasksQueryOptions(workspaceId: number) {
  return queryOptions({
    queryKey: ["tasks", workspaceId],
    queryFn: () => getTasks(workspaceId),
    throwOnError: true,
  });
}
