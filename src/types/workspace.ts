import z from "zod";

// Workspace data returned by the backend for the authenticated user's workspaces.
export type WorkspaceResponse = z.infer<typeof workspaceResponseSchema>;

export const workspaceResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  role: z.enum(["admin", "member"]),
});

// Payload for workspace creation.
export type WorkspaceCreation = z.infer<typeof workspaceCreationSchema>;

export const workspaceCreationSchema = z.object({
  title: z
    .string()
    .min(1, "Title must be between 1 and 50 characters.")
    .max(50, "Title must be between 1 and 50 characters."),
});

// Payload for workspace update.
export type WorkspaceUpdate = z.infer<typeof workspaceUpdateSchema>;

export const workspaceUpdateSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, "Title must be between 1 and 50 characters.")
    .max(50, "Title must be between 1 and 50 characters."),
});

export type WorkspaceMembersResponse = z.infer<
  typeof workspaceMembersResponseSchema
>;

export const workspaceMembersResponseSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  role: z.enum(["admin", "member"]),
});
