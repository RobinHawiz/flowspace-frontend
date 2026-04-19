import request from "@api/request";
import {
  workspaceMembersResponseSchema,
  workspaceResponseSchema,
  type WorkspaceCreation,
  type WorkspaceMembersAdd,
  type WorkspaceUpdate,
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

export async function getWorkspace(id: number) {
  const options = {
    method: "GET" as const,
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  const response = await request(`/workspaces/${id}`, options);
  const workspace = workspaceResponseSchema.parse(response);
  return workspace;
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

export async function updateWorkspace(workspace: WorkspaceUpdate) {
  // Simulate network delay
  await delay(700);

  const options = {
    method: "PATCH" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: workspace.title }),
    credentials: "include" as const,
  };
  await request(`/workspaces/${workspace.id}`, options);
}

export async function deleteWorkspace(workspaceId: number) {
  // Simulate network delay
  await delay(700);

  const options = {
    method: "DELETE" as const,
    credentials: "include" as const,
  };
  await request(`/workspaces/${workspaceId}`, options);
}

export async function getWorkspaceMembers(id: number) {
  const options = {
    method: "GET" as const,
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  const response = (await request(
    `/workspaces/${id}/members`,
    options,
  )) as Array<unknown>;
  const workspace = response.map((member: unknown) =>
    workspaceMembersResponseSchema.parse(member),
  );
  return workspace;
}

export async function addWorkspaceMember(payload: WorkspaceMembersAdd) {
  const options = {
    method: "POST" as const,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: payload.email }),
    credentials: "include" as const,
  };
  // Simulate network latency.
  await delay(700);
  const response = await request(`/workspaces/${payload.id}/members`, options);
  const workspaceMember = workspaceMembersResponseSchema.parse(response);
  return workspaceMember;
}
