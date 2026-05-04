import type { RefObject } from "react";
import FormModal from "@components/FormModal";
import type { TaskResponse } from "@customTypes/task";
import date from "@images/date.svg";
import column from "@images/column-task-modal.svg";

type Props = {
  task: TaskResponse;
  workspaceColumnTitle: string;
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
};

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  const [day, month, year] = date
    .toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
    .split(" ");
  return `${day} ${month}, ${year}`;
}

function TaskDetailsModal({
  task,
  workspaceColumnTitle,
  dialogRef,
  onClose,
}: Props) {
  const formattedDate = task.deadline ? formatDeadline(task.deadline) : null;

  return (
    <FormModal dialogRef={dialogRef} onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex gap-2.5 text-sm font-bold">
          <span
            className={`${
              task.priority === "high"
                ? "bg-red-100 text-red-600"
                : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-600"
                  : task.priority === "low"
                    ? "bg-green-100 text-green-600"
                    : ""
            } rounded-full px-3.75 py-1.25`}
          >
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-current"></span>
            <p className="inline">{`${task.priority[0].toUpperCase() + task.priority.slice(1)} priority`}</p>
          </span>
          {formattedDate && (
            <span className="flex-center gap-2 rounded-full bg-slate-200 px-3.75 py-1.25 text-slate-500">
              <img src={date} alt="" />
              <p>{formattedDate}</p>
            </span>
          )}
          <span className="flex-center gap-2 rounded-full bg-black/10 px-3.75 py-1.25 text-black">
            <img src={column} alt="" />
            <p>{workspaceColumnTitle}</p>
          </span>
        </div>
        <h2 className="text-lg font-bold">{task.title}</h2>
        <p className="text-slate-500">{task.description}</p>
      </div>
    </FormModal>
  );
}

export default TaskDetailsModal;
