import z from "zod";

// Workspace data returned by the backend for the authenticated user's workspaces.
export type WorkspaceResponse = z.infer<typeof workspaceResponseSchema>;

export const workspaceResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  role: z.enum(["admin", "member"]),
});
