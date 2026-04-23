import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import type {
  WorkspaceColumnOrderUpdate,
  WorkspaceColumnResponse,
} from "@customTypes/workspaceColumn";
import WorkspaceColumn from "@protectedRoutes/workspace/components/WorkspaceColumn";
import { workspaceColumnOrderUpdateMutationOptions } from "@hooks/queryOptions";
import { AppError } from "@customTypes/appError";
import { toast } from "react-toastify";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import addColumn from "@images/add-column.svg";

function Sortable({
  id,
  index,
  column,
  isPending,
  openEditWorkspaceColumnModal,
}: {
  id: number;
  index: number;
  column: WorkspaceColumnResponse;
  isPending: boolean;
  openEditWorkspaceColumnModal: (
    workspaceColumn: WorkspaceColumnResponse,
  ) => void;
}) {
  const handleRef = useRef<HTMLHeadingElement | null>(null);
  const { ref } = useSortable({
    id,
    index,
    handle: handleRef,
    disabled: isPending,
  });

  return (
    <>
      <li ref={ref} className="relative">
        <WorkspaceColumn
          handleRef={handleRef}
          workspaceColumn={column}
          isDraggingDisabled={isPending}
          openEditWorkspaceColumnModal={openEditWorkspaceColumnModal}
        />
      </li>
    </>
  );
}

type Props = {
  workspaceId: number;
  workspaceColumns: Array<WorkspaceColumnResponse>;
  openAddWorkspaceColumnModal: () => void;
  openEditWorkspaceColumnModal: (
    workspaceColumn: WorkspaceColumnResponse,
  ) => void;
};

function WorkspaceColumns({
  workspaceId,
  workspaceColumns,
  openAddWorkspaceColumnModal,
  openEditWorkspaceColumnModal,
}: Props) {
  const { mutateAsync: workspaceColumnOrderUpdate, isPending } = useMutation(
    workspaceColumnOrderUpdateMutationOptions(),
  );
  const handleExpiredSession = useHandleExpiredSession();

  return (
    <div className="xs:px-25 flex w-max gap-7.5 px-7.5 pt-4">
      <ul className="flex gap-7.5">
        <DragDropProvider
          onDragEnd={async (event) => {
            const { source } = event.operation;
            if (isSortable(source)) {
              const { initialIndex, index } = source;
              if (initialIndex === index) return; // No change in order, so we can skip the update
              const payload: WorkspaceColumnOrderUpdate = {
                workspaceId,
                workspaceColumnId: Number(source.id),
                workspaceColumnOrderNew: index,
                workspaceColumnOrderCurrent: initialIndex,
              };
              try {
                await workspaceColumnOrderUpdate(payload);
              } catch (err) {
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
          {workspaceColumns.map((column, index) => {
            return (
              <Sortable
                key={column.id}
                id={column.id}
                index={index}
                column={column}
                isPending={isPending}
                openEditWorkspaceColumnModal={openEditWorkspaceColumnModal}
              />
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
