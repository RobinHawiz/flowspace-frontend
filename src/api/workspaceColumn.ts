import request from "@api/request";
import {
  workspaceColumnResponseSchema,
  type WorkspaceColumnCreation,
  type WorkspaceColumnOrderUpdate,
  type WorkspaceColumnTitleUpdate,
} from "@customTypes/workspaceColumn";
import delay from "@utils/delay";

export async function getWorkspaceColumns(workspaceId: number) {
  const options = {
    method: "GET" as const,
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  const response = (await request(
    `/workspaces/${workspaceId}/workspace-columns`,
    options,
  )) as Array<unknown>;
  const columns = response.map((column) =>
    workspaceColumnResponseSchema.parse(column),
  );
  return columns;
}

export async function updateWorkspaceColumnOrder(
  payload: WorkspaceColumnOrderUpdate,
) {
  const options = {
    method: "PATCH" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      workspaceColumnOrder: payload.workspaceColumnOrderNew,
    }),
    credentials: "include" as const,
  };

  await request(
    `/workspaces/${payload.workspaceId}/workspace-columns/${payload.workspaceColumnId}/order`,
    options,
  );
}

export async function updateWorkspaceColumnTitle(
  payload: WorkspaceColumnTitleUpdate,
) {
  const options = {
    method: "PATCH" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
    }),
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  await request(
    `/workspaces/${payload.workspaceId}/workspace-columns/${payload.workspaceColumnId}/title`,
    options,
  );
}

export async function addWorkspaceColumn(payload: WorkspaceColumnCreation) {
  const options = {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: payload.title,
      workspaceColumnOrder: payload.workspaceColumnOrder,
    }),
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  const response = (await request(
    `/workspaces/${payload.workspaceId}/workspace-columns`,
    options,
  )) as unknown;
  const workspaceColumn = workspaceColumnResponseSchema.parse(response);
  return workspaceColumn;
}
