import type { TaskResponse } from "@customTypes/task";

type Props = {
  task: TaskResponse;
  isDraggingDisabled: boolean;
  ref: (element: Element | null) => void;
};

function Task({ task, isDraggingDisabled, ref }: Props) {
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
      } bg-white p-2.5 shadow-sm ${isDraggingDisabled ? "cursor-auto" : "cursor-grab"}`}
    >
      {task.title}
    </li>
  );
}

export default Task;
