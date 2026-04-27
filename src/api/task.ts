import request from "@api/request";
import { taskResponseSchema, type TaskOrderUpdate } from "@customTypes/task";

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
