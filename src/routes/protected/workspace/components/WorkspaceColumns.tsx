import { useMemo, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useMutation } from "@tanstack/react-query";
import { isSortable } from "@dnd-kit/react/sortable";
import { toast } from "react-toastify";
import { AppError } from "@customTypes/appError";
import WorkspaceColumn from "@protectedRoutes/workspace/components/WorkspaceColumn";
import Task from "@protectedRoutes/workspace/components/Task";
import {
  moveTaskToDifferentColumnMutationOptions,
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
  openAddTaskModal: (workspaceColumn: WorkspaceColumnResponse) => void;
};

function WorkspaceColumns({
  workspaceId,
  workspaceColumns,
  tasks,
  openAddWorkspaceColumnModal,
  openEditWorkspaceColumnModal,
  openAddTaskModal,
}: Props) {
  const {
    mutateAsync: updateWorkspaceColumnOrder,
    isPending: isUpdatingWorkspaceColumnOrder,
  } = useMutation(workspaceColumnOrderUpdateMutationOptions());
  const { mutateAsync: updateTaskOrder, isPending: isUpdatingTaskOrder } =
    useMutation(taskOrderUpdateMutationOptions());
  const handleExpiredSession = useHandleExpiredSession();
  const {
    mutateAsync: moveTaskToDifferentColumn,
    isPending: isMovingTaskToDifferentColumn,
  } = useMutation(moveTaskToDifferentColumnMutationOptions());
  const [tempBoardState, setTempBoardState] = useState<Record<
    number,
    Array<TaskResponse>
  > | null>(null);

  const baseBoardState = useMemo(() => {
    const state: Record<number, Array<TaskResponse>> = {};
    workspaceColumns.forEach((column) => {
      state[column.id] = tasks.filter(
        (task) => task.workspaceColumnId === column.id,
      );
    });
    return state;
  }, [workspaceColumns, tasks]);

  const renderedBoardState = tempBoardState ?? baseBoardState;

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
    <div className="xs:px-25 flex w-max gap-7.5 px-7.5 py-4">
      <ul className="flex gap-7.5">
        <DragDropProvider
          onDragOver={({ operation }) => {
            const { source, target } = operation;
            if (!source || !target) return;
            if (source.type === "column") return;
            const currentBoardState = tempBoardState ?? baseBoardState;
            const nextBoardState = { ...currentBoardState };
            if (isSortable(source)) {
              const task = source.data as TaskResponse;
              const prevWorkspaceColumnId = Number(
                Object.keys(currentBoardState).find((columnId) => {
                  return currentBoardState[Number(columnId)].some(
                    (t) => t.id === task.id,
                  );
                })!,
              );
              // Remove the task from its previous column position optimistically
              nextBoardState[prevWorkspaceColumnId] = nextBoardState[
                prevWorkspaceColumnId
              ].filter((t) => t.id !== task.id);
              if (isSortable(target)) {
                const newWorkspaceColumnId = target.group as number;
                // Task was dragged over the same column or to another column (Sortable)
                if (source.type === "task" && target.type === "task") {
                  // Insert the task into its new column position optimistically
                  nextBoardState[newWorkspaceColumnId] = nextBoardState[
                    newWorkspaceColumnId
                  ].toSpliced(target.index, 0, task);
                  setTempBoardState(nextBoardState);
                }
              }
              // Task was dragged over an empty column (Droppable)
              else {
                const newWorkspaceColumnId = Number(target.id);
                // Insert the task into its new column position optimistically
                nextBoardState[newWorkspaceColumnId] = nextBoardState[
                  newWorkspaceColumnId
                ].toSpliced(0, 0, task);
                setTempBoardState(nextBoardState);
              }
            }
          }}
          onDragEnd={async (event) => {
            const { source, target } = event.operation;
            if (!source || !target) return;
            if (isSortable(source)) {
              if (isSortable(target)) {
                // Task was dragged within the same column or to another column (Sortable)
                if (source.type === "task" && target.type === "task") {
                  const { workspaceColumnId } = source.data as TaskResponse;
                  // Task was dragged to a different column (Sortable)
                  if (workspaceColumnId !== target.group) {
                    const {
                      id: taskId,
                      taskOrder: prevTaskOrder,
                      workspaceColumnId: prevWorkspaceColumnId,
                    } = source.data as TaskResponse;
                    const newTaskOrder = target.index;
                    try {
                      await moveTaskToDifferentColumn({
                        workspaceId,
                        taskId,
                        prevTaskOrder,
                        prevWorkspaceColumnId,
                        newWorkspaceColumnId: Number(target.group),
                        newTaskOrder,
                      });
                    } catch (err) {
                      await handleTaskOrderError(err);
                    } finally {
                      setTempBoardState(null);
                    }
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
                    } finally {
                      setTempBoardState(null);
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
                  } finally {
                    setTempBoardState(null);
                  }
                }
              }
              // Task was dragged to an empty column (Droppable)
              else {
                const {
                  id: taskId,
                  taskOrder: prevTaskOrder,
                  workspaceColumnId: prevWorkspaceColumnId,
                } = source.data as TaskResponse;
                const newWorkspaceColumnId = Number(target.id);
                const newTaskOrder = 0;

                try {
                  await moveTaskToDifferentColumn({
                    workspaceId,
                    taskId,
                    prevTaskOrder,
                    prevWorkspaceColumnId,
                    newWorkspaceColumnId,
                    newTaskOrder,
                  });
                } catch (err) {
                  await handleTaskOrderError(err);
                } finally {
                  setTempBoardState(null);
                }
              }
            }
          }}
        >
          {workspaceColumns.map((column, index) => {
            const columnTasks = renderedBoardState[column.id] ?? [];
            return (
              <WorkspaceColumn
                key={column.id}
                index={index}
                isEmpty={columnTasks.length === 0}
                isDisabled={isUpdatingWorkspaceColumnOrder}
                workspaceColumn={column}
                openAddTaskModal={openAddTaskModal}
                openEditWorkspaceColumnModal={openEditWorkspaceColumnModal}
              >
                {columnTasks.map((task, index) => {
                  return (
                    <Task
                      key={task.id}
                      index={index}
                      task={task}
                      workspaceColumnId={column.id}
                      isDisabled={
                        isUpdatingTaskOrder || isMovingTaskToDifferentColumn
                      }
                    />
                  );
                })}
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
