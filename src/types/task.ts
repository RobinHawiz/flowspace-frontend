import z from "zod";

// Task data returned by the backend for the authenticated user's workspace.
export type TaskResponse = z.infer<typeof taskResponseSchema>;

export const taskResponseSchema = z.object({
  id: z.number(),
  workspaceColumnId: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z.string().nullable(),
  taskOrder: z.number(),
  createdAt: z.string(),
});

export type TaskOrderUpdate = z.infer<typeof taskOrderUpdateSchema>;

export const taskOrderUpdateSchema = z.object({
  workspaceId: z.number(),
  workspaceColumnId: z.number(),
  taskId: z.number(),
  currentTaskOrder: z.number(),
  newTaskOrder: z.number(),
});
