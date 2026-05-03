import { useRef } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { TaskResponse } from "@customTypes/task";
import drag from "@images/drag.svg";

type Props = {
  index: number;
  task: TaskResponse;
  workspaceColumnId: number;
  isDisabled: boolean;
};

function Task({ task, index, workspaceColumnId, isDisabled }: Props) {
  const handleRef = useRef<HTMLSpanElement | null>(null);
  const { ref } = useSortable({
    id: task.id,
    index,
    handle: handleRef,
    type: "task",
    accept: ["task"],
    group: workspaceColumnId,
    data: task,
    disabled: isDisabled,
  });

  return (
    <li
      ref={ref}
      key={task.id}
      className={`rounded-lg border-l-3 border-solid ${
        task.priority === "high"
          ? "border-red-500"
          : task.priority === "medium"
            ? "border-yellow-500"
            : task.priority === "low"
              ? "border-green-500"
              : ""
      } hover:outline-accent relative bg-white px-4.25 py-2.5 shadow-sm outline-3 outline-transparent transition-all duration-75 ease-in-out hover:border-0 hover:shadow-md`}
    >
      <span
        ref={handleRef}
        className="focus:outline-accent absolute top-0 right-0 z-10 m-1 cursor-grab rounded-sm p-1 focus:outline-2"
      >
        <img src={drag} alt="Drag handle" />
      </span>
      <p className="wrap-break-word select-none">{task.title}</p>
      <button className="focus-visible:outline-accent absolute top-0 left-0 h-full w-full cursor-pointer rounded-lg pl-3 focus-visible:outline-3"></button>
    </li>
  );
}

export default Task;
