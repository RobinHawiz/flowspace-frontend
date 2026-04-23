import type { RefObject } from "react";
import type { WorkspaceColumnResponse } from "@customTypes/workspaceColumn";
import editColumn from "@images/edit-column.svg";

type Props = {
  workspaceColumn: WorkspaceColumnResponse;
  isDraggingDisabled: boolean;
  handleRef: RefObject<HTMLHeadingElement | null>;
  openEditWorkspaceColumnModal: (
    workspaceColumn: WorkspaceColumnResponse,
  ) => void;
};

function WorkspaceColumn({
  workspaceColumn,
  isDraggingDisabled,
  handleRef,
  openEditWorkspaceColumnModal,
}: Props) {
  return (
    <div className="border-accent w-full max-w-70 rounded-lg border border-solid bg-white/28 p-2.5 shadow-md backdrop-blur-sm">
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
      {/* Placeholder task content, replace with actual tasks when implemented. */}
      <ul className="flex flex-col gap-3">
        <li className="rounded-lg border-l-3 border-solid border-red-500 bg-white p-2.5 shadow-sm">
          Fix UI bugs
        </li>
        <li className="rounded-lg border-l-3 border-solid border-yellow-500 bg-white p-2.5 shadow-sm">
          Optimize images and assets
        </li>
        <li className="rounded-lg border-l-3 border-solid border-green-500 bg-white p-2.5 shadow-sm">
          Check accessibility issues
        </li>
      </ul>
    </div>
  );
}

export default WorkspaceColumn;
