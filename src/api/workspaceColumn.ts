import request from "@api/request";
import {
  workspaceColumnResponseSchema,
  type WorkspaceColumnOrderUpdate,
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
