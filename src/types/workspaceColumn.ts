import z from "zod";

// Workspace column data returned by the backend for the authenticated user's workspace.
export type WorkspaceColumnResponse = z.infer<
  typeof workspaceColumnResponseSchema
>;

export const workspaceColumnResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  workspaceColumnOrder: z.number(),
});

// Payload for workspace column order update.
export type WorkspaceColumnOrderUpdate = z.infer<
  typeof workspaceColumnOrderUpdateSchema
>;

export const workspaceColumnOrderUpdateSchema = z.object({
  workspaceId: z.number(),
  workspaceColumnId: z.number(),
  workspaceColumnOrderNew: z.number(),
  workspaceColumnOrderCurrent: z.number(),
});
