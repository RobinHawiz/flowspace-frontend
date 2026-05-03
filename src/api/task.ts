import request from "@api/request";
import {
  taskResponseSchema,
  type MoveTaskToDifferentColumn,
  type TaskCreation,
  type TaskOrderUpdate,
} from "@customTypes/task";
import delay from "@utils/delay";

export async function getTasks(workspaceId: number) {
  const options = {
    method: "GET" as const,
    credentials: "include" as const,
  };
  const response = (await request(
    `/workspaces/${workspaceId}/tasks`,
    options,
  )) as Array<unknown>;
  const tasks = response.map((task) => taskResponseSchema.parse(task));
  return tasks;
}

export async function updateTaskOrder(payload: TaskOrderUpdate) {
  const { workspaceId, workspaceColumnId, taskId, newTaskOrder } = payload;
  const options = {
    method: "PATCH" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ workspaceColumnId, taskOrder: newTaskOrder }),
    credentials: "include" as const,
  };

  await request(`/workspaces/${workspaceId}/tasks/${taskId}/order`, options);
}

export async function moveTaskToDifferentColumn(
  payload: MoveTaskToDifferentColumn,
) {
  const {
    workspaceId,
    prevWorkspaceColumnId: workspaceColumnId,
    taskId,
    newWorkspaceColumnId,
    newTaskOrder,
  } = payload;
  const options = {
    method: "PATCH" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workspaceColumnId,
      newWorkspaceColumnId,
      newTaskOrder,
    }),
    credentials: "include" as const,
  };

  await request(`/workspaces/${workspaceId}/tasks/${taskId}/move`, options);
}

export async function addTask(payload: TaskCreation) {
  const {
    workspaceId,
    workspaceColumnId,
    title,
    description,
    priority,
    deadline,
    taskOrder,
  } = payload;
  const options = {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workspaceColumnId,
      title,
      description,
      priority,
      deadline,
      taskOrder,
    }),
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  const response = await request(`/workspaces/${workspaceId}/tasks`, options);
  const task = taskResponseSchema.parse(response);
  return task;
}
