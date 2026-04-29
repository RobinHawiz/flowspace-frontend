import { DragDropProvider } from "@dnd-kit/react";
import { useMutation } from "@tanstack/react-query";
import { isSortable } from "@dnd-kit/react/sortable";
import { toast } from "react-toastify";
import { AppError } from "@customTypes/appError";
import WorkspaceColumn from "@protectedRoutes/workspace/components/WorkspaceColumn";
import Task from "@protectedRoutes/workspace/components/Task";
import {
  taskOrderUpdateMutationOptions,
  workspaceColumnOrderUpdateMutationOptions,
} from "@hooks/queryOptions";
import type { TaskResponse } from "@customTypes/task";
import type { WorkspaceColumnResponse } from "@customTypes/workspaceColumn";
import addColumn from "@images/add-column.svg";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";

type Props = {
  workspaceId: number;
  workspaceColumns: Array<WorkspaceColumnResponse>;
  tasks: Array<TaskResponse>;
  openAddWorkspaceColumnModal: () => void;
  openEditWorkspaceColumnModal: (
    workspaceColumn: WorkspaceColumnResponse,
  ) => void;
};

function WorkspaceColumns({
  workspaceId,
  workspaceColumns,
  tasks,
  openAddWorkspaceColumnModal,
  openEditWorkspaceColumnModal,
}: Props) {
  const {
    mutateAsync: updateWorkspaceColumnOrder,
    isPending: isUpdatingWorkspaceColumnOrder,
  } = useMutation(workspaceColumnOrderUpdateMutationOptions());
  const { mutateAsync: updateTaskOrder, isPending: isUpdatingTaskOrder } =
    useMutation(taskOrderUpdateMutationOptions());
  const handleExpiredSession = useHandleExpiredSession();

  const handleTaskOrderError = async (err: unknown) => {
    if (err instanceof AppError) {
      switch (err.statusCode) {
        case 401:
          await handleExpiredSession();
          break;
        case 403:
          toast.error(
            "You don't have permission to change the task order in this workspace.",
          );
          break;
        case 400:
          toast.error(
            "Something went wrong while changing the task order. Please try again.",
          );
          break;
        default:
          toast.error("An unexpected error occurred. Please try again.");
      }
      console.error(err.message);
    } else {
      const errorMessage = getUnexpectedFormErrorMessage(err);
      toast.error(errorMessage);
    }
  };

  const handleWorkspaceColumnOrderError = async (err: unknown) => {
    if (err instanceof AppError) {
      switch (err.statusCode) {
        case 401:
          await handleExpiredSession();
          break;
        case 403:
          toast.error(
            "You don't have permission to change the column order in this workspace.",
          );
          break;
        case 400:
          toast.error(
            "Something went wrong while changing the column order. Please try again.",
          );
          break;
        default:
          toast.error("An unexpected error occurred. Please try again.");
      }
      console.error(err.message);
    } else {
      const errorMessage = getUnexpectedFormErrorMessage(err);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="xs:px-25 flex w-max gap-7.5 px-7.5 pt-4">
      <ul className="flex gap-7.5">
        <DragDropProvider
          onDragEnd={async (event) => {
            const { source, target } = event.operation;
            if (!source || !target) return;
            if (isSortable(source)) {
              if (isSortable(target)) {
                // Task was dragged within the same column or to another column (Sortable)
                if (source.type === "task" && target.type === "task") {
                  // Task was dragged to a different column (Sortable)
                  if (source.group !== target.group) {
                    // TODO: Handle task being dragged to a different column (Sortable)
                    return;
                  }
                  // Task was dragged within the same column (Sortable)
                  else {
                    const {
                      id: taskId,
                      workspaceColumnId,
                      taskOrder: currentTaskOrder,
                    } = source.data as TaskResponse;
                    const newTaskOrder = source.index;
                    try {
                      await updateTaskOrder({
                        workspaceId,
                        workspaceColumnId,
                        taskId,
                        currentTaskOrder,
                        newTaskOrder,
                      });
                    } catch (err) {
                      await handleTaskOrderError(err);
                    }
                  }
                }
                // Column was dragged to a different position (Sortable)
                else {
                  const {
                    id: workspaceColumnId,
                    workspaceColumnOrder: workspaceColumnOrderCurrent,
                  } = source.data as WorkspaceColumnResponse;
                  const workspaceColumnOrderNew = source.index;
                  try {
                    await updateWorkspaceColumnOrder({
                      workspaceId,
                      workspaceColumnId,
                      workspaceColumnOrderCurrent,
                      workspaceColumnOrderNew,
                    });
                  } catch (err) {
                    await handleWorkspaceColumnOrderError(err);
                  }
                }
              }
              // Task was dragged to an empty column (Droppable)
              else {
                // TODO: Handle task being dragged to an empty column (Droppable)
                return;
              }
            }
          }}
        >
          {workspaceColumns.map((column, index) => {
            const columnTasks = tasks.filter(
              (task) => task.workspaceColumnId === column.id,
            );
            return (
              <WorkspaceColumn
                key={column.id}
                index={index}
                isEmpty={columnTasks.length === 0}
                isDisabled={isUpdatingWorkspaceColumnOrder}
                workspaceColumn={column}
                openEditWorkspaceColumnModal={openEditWorkspaceColumnModal}
              >
                {columnTasks.map((task, index) => (
                  <Task
                    key={task.id}
                    index={index}
                    task={task}
                    workspaceColumnId={column.id}
                    isDisabled={isUpdatingTaskOrder}
                  />
                ))}
              </WorkspaceColumn>
            );
          })}
        </DragDropProvider>
      </ul>
      <button
        onClick={openAddWorkspaceColumnModal}
        className="btn focus:outline-accent gap-2.5 self-start rounded-lg border-none bg-pink-200 p-2.5 text-rose-600 hover:bg-pink-300"
      >
        <p className="mr-auto">Add column</p>
        <img src={addColumn} />
      </button>
    </div>
  );
}

export default WorkspaceColumns;
