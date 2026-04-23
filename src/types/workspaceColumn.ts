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

export type WorkspaceColumnCreation = z.infer<
  typeof WorkspaceColumnCreationSchema
>;

export const WorkspaceColumnCreationSchema = z.object({
  workspaceId: z.number(),
  title: z
    .string()
    .min(1, "Column title cannot be empty")
    .max(200, "Column title cannot exceed 200 characters."),
  workspaceColumnOrder: z.number(),
});

export type WorkspaceColumnTitleUpdate = z.infer<
  typeof WorkspaceColumnTitleUpdateSchema
>;

export const WorkspaceColumnTitleUpdateSchema = z.object({
  workspaceId: z.number(),
  workspaceColumnId: z.number(),
  title: z
    .string()
    .min(1, "Column title cannot be empty")
    .max(200, "Column title cannot exceed 200 characters."),
});

export type WorkspaceColumnDeletion = z.infer<
  typeof WorkspaceColumnDeletionSchema
>;

export const WorkspaceColumnDeletionSchema = z.object({
  workspaceId: z.number(),
  workspaceColumnId: z.number(),
});
