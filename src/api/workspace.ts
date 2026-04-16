import request from "@api/request";
import { workspaceResponseSchema } from "@customTypes/workspace";
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
