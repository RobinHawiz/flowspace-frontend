import { useRef, type PropsWithChildren } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { WorkspaceColumnResponse } from "@customTypes/workspaceColumn";
import editColumn from "@images/edit-column.svg";
import addTask from "@images/add-task.svg";
import { useDroppable } from "@dnd-kit/react";

interface Props extends PropsWithChildren {
  index: number;
  workspaceColumn: WorkspaceColumnResponse;
  isEmpty: boolean;
  isDisabled: boolean;
  openEditWorkspaceColumnModal: (
    workspaceColumn: WorkspaceColumnResponse,
  ) => void;
  openAddTaskModal: (workspaceColumn: WorkspaceColumnResponse) => void;
}

function WorkspaceColumn({
  index,
  workspaceColumn,
  children,
  isEmpty,
  isDisabled,
  openEditWorkspaceColumnModal,
  openAddTaskModal,
}: Props) {
  const handleRef = useRef<HTMLHeadingElement | null>(null);
  const { ref } = useSortable({
    id: workspaceColumn.id,
    index,
    handle: handleRef,
    type: "column",
    accept: ["column"],
    data: workspaceColumn,
    disabled: isDisabled,
  });

  const { ref: droppableRef } = useDroppable({
    id: `${workspaceColumn.id}`,
    type: "droppable",
    accept: ["task"],
    disabled: !isEmpty,
  });

  return (
    <li ref={ref} className="relative">
      <div className="border-accent max-w-70 min-w-70 rounded-lg border border-solid bg-white/28 shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-2 p-2.5">
          <h2
            ref={(node) => {
              handleRef.current = node;
            }}
            className="w-full cursor-grab pl-2.5 text-lg font-bold"
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
        <div
          ref={droppableRef}
          className="max-h-[70svh] min-h-25 overflow-y-auto p-2.5"
        >
          <ul className="relative z-10 flex flex-col gap-3">{children}</ul>
        </div>
        <div className="p-2.5">
          <button
            onClick={() => openAddTaskModal(workspaceColumn)}
            className="btn focus:outline-accent w-full gap-2.5 rounded-lg border-none bg-pink-200 p-2.5 text-rose-600 hover:bg-pink-300"
          >
            <p className="">Add task</p>
            <img src={addTask} />
          </button>
        </div>
      </div>
    </li>
  );
}

export default WorkspaceColumn;
