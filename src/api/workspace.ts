import request from "@api/request";
import {
  workspaceResponseSchema,
  type WorkspaceCreation,
} from "@customTypes/workspace";
import delay from "@utils/delay";

export async function getWorkspaces() {
  const options = {
    method: "GET" as const,
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  const response = (await request(`/workspaces`, options)) as Array<unknown>;
  const workspaces = response.map((workspace) =>
    workspaceResponseSchema.parse(workspace),
  );
  return workspaces;
}

export async function createWorkspace(payload: WorkspaceCreation) {
  const options = {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  const response = await request(`/workspaces`, options);
  const workspace = workspaceResponseSchema.parse(response);
  return workspace;
}
