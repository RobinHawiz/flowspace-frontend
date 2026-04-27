import { type RefObject } from "react";
import { useMutation } from "@tanstack/react-query";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { toast } from "react-toastify";
import { taskOrderUpdateMutationOptions } from "@hooks/queryOptions";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import { AppError } from "@customTypes/appError";
import type { WorkspaceColumnResponse } from "@customTypes/workspaceColumn";
import type { TaskOrderUpdate, TaskResponse } from "@customTypes/task";
import editColumn from "@images/edit-column.svg";
import Task from "@protectedRoutes/workspace/components/Task";

function Sortable({
  id,
  index,
  task,
  isPending,
}: {
  id: number;
  index: number;
  task: TaskResponse;
  isPending: boolean;
}) {
  const { ref } = useSortable({
    id,
    index,
    disabled: isPending,
  });

  return <Task ref={ref} task={task} isDraggingDisabled={isPending} />;
}

type Props = {
  workspaceId: number;
  workspaceColumn: WorkspaceColumnResponse;
  tasks: Array<TaskResponse>;
  isDraggingDisabled: boolean;
  handleRef: RefObject<HTMLHeadingElement | null>;
  openEditWorkspaceColumnModal: (
    workspaceColumn: WorkspaceColumnResponse,
  ) => void;
};

function WorkspaceColumn({
  workspaceId,
  workspaceColumn,
  tasks,
  isDraggingDisabled,
  handleRef,
  openEditWorkspaceColumnModal,
}: Props) {
  const { mutateAsync: taskOrderUpdate, isPending } = useMutation(
    taskOrderUpdateMutationOptions(),
  );
  const handleExpiredSession = useHandleExpiredSession();

  return (
    <div className="border-accent max-w-70 min-w-70 rounded-lg border border-solid bg-white/28 p-2.5 shadow-md backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <h2
          ref={(node) => {
            handleRef.current = node;
          }}
          className={`w-full pl-2.5 text-lg font-bold ${isDraggingDisabled ? "cursor-auto" : "cursor-grab"}`}
        >
          {workspaceColumn.title}
        </h2>
        <button
          onClick={() => openEditWorkspaceColumnModal(workspaceColumn)}
          className="btn focus:outline-accent gap-2.5 self-start rounded-lg border-none bg-pink-200 p-2.5 text-rose-600 hover:bg-pink-300"
        >
          <img src={editColumn} />
        </button>
      </div>
      <ul className="flex flex-col gap-3">
        <DragDropProvider
          onDragEnd={async (event) => {
            const { source } = event.operation;
            if (isSortable(source)) {
              const { initialIndex, index } = source;
              if (initialIndex === index) return; // No change in order, so we can skip the update
              const payload: TaskOrderUpdate = {
                workspaceId,
                workspaceColumnId: workspaceColumn.id,
                taskId: Number(source.id),
                currentTaskOrder: initialIndex,
                newTaskOrder: index,
              };
              try {
                await taskOrderUpdate(payload);
              } catch (err) {
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
                      toast.error(
                        "An unexpected error occurred. Please try again.",
                      );
                  }
                  console.error(err.message);
                } else {
                  const errorMessage = getUnexpectedFormErrorMessage(err);
                  toast.error(errorMessage);
                }
              }
            }
          }}
        >
          {tasks.map((task, index) => (
            <Sortable
              key={task.id}
              id={task.id}
              index={index}
              task={task}
              isPending={isPending}
            />
          ))}
        </DragDropProvider>
      </ul>
    </div>
  );
}

export default WorkspaceColumn;
