import { useEffect, useRef } from "react";
import { Sortable } from "@dnd-kit/dom/sortable";
import { DragDropManager } from "@dnd-kit/dom";
import type { WorkspaceColumnResponse } from "@customTypes/workspaceColumn";
import WorkspaceColumn from "@protectedRoutes/workspace/components/WorkspaceColumn";

type Props = {
  workspaceColumns: Array<WorkspaceColumnResponse>;
};
function WorkspaceColumns({ workspaceColumns }: Props) {
  const columnSortableElems = useRef<Record<number, HTMLLIElement | null>>({});
  const columnHandleElems = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const manager = new DragDropManager();
    workspaceColumns.forEach((column, index) => {
      const element = columnSortableElems.current[column.id];
      const handle = columnHandleElems.current[column.id];
      if (!element || !handle) return;
      new Sortable(
        {
          id: column.id,
          index,
          element,
          handle,
        },
        manager,
      );
    });
    return () => {
      manager.destroy();
    };
  }, [workspaceColumns]);

  return (
    <ul className="mx-auto flex w-[90%] gap-7.5 pt-4">
      {workspaceColumns.map((column) => {
        return (
          <li
            ref={(node) => {
              columnSortableElems.current[column.id] = node;
            }}
            key={column.id}
            className="relative"
          >
            <div
              ref={(node) => {
                columnHandleElems.current[column.id] = node;
              }}
              className="absolute top-0 left-0 z-10 h-11 w-full cursor-grab"
            ></div>
            <WorkspaceColumn workspaceColumn={column} />
          </li>
        );
      })}
    </ul>
  );
}

export default WorkspaceColumns;
