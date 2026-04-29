import type { TaskResponse } from "@customTypes/task";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
  index: number;
  task: TaskResponse;
  workspaceColumnId: number;
  isDisabled: boolean;
};

function Task({ task, index, workspaceColumnId, isDisabled }: Props) {
  const { ref } = useSortable({
    id: task.id,
    index,
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
      } cursor-grab bg-white p-2.5 shadow-sm`}
    >
      <p className="select-none">{task.title}</p>
    </li>
  );
}

export default Task;
