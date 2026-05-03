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

export type MoveTaskToDifferentColumn = z.infer<
  typeof moveTaskToDifferentColumnSchema
>;

export const moveTaskToDifferentColumnSchema = z.object({
  workspaceId: z.number(),
  taskId: z.number(),
  prevTaskOrder: z.number(),
  prevWorkspaceColumnId: z.number(),
  newWorkspaceColumnId: z.number(),
  newTaskOrder: z.number(),
});

export type TaskCreation = z.infer<typeof taskCreationSchema>;

export const taskCreationSchema = z.object({
  workspaceId: z.number(),
  workspaceColumnId: z.number(),
  title: z
    .string()
    .min(1, "Task title cannot be empty")
    .max(200, "Task title cannot exceed 200 characters."),
  description: z.string().nullable(),
  priority: z.enum(["low", "medium", "high"]),
  deadline: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
      "Deadline must be in ISO format (e.g. 2023-12-31T23:59:59.000Z)",
    )
    .nullable(),
  taskOrder: z.number(),
});
