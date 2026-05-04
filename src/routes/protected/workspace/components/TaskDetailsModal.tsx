import { useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import FormModal from "@components/FormModal";
import type { TaskResponse } from "@customTypes/task";
import date from "@images/date.svg";
import column from "@images/column-task-modal.svg";
import editTask from "@images/edit-task.svg";
import TaskUpdateModal from "@protectedRoutes/workspace/components/TaskUpdateModal";
import delay from "@utils/delay";

type Props = {
  workspaceId: number;
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
  workspaceId,
  task,
  workspaceColumnTitle,
  dialogRef,
  onClose,
}: Props) {
  const [successMessage, setSuccessMessage] = useState("");
  const [isTaskUpdateOpen, setIsTaskUpdateOpen] = useState(false);
  const taskUpdateModalRef = useRef<HTMLDialogElement | null>(null);
  const formattedDate = task.deadline ? formatDeadline(task.deadline) : null;

  const openTaskUpdateModal = async () => {
    setIsTaskUpdateOpen(true);
    // Wait for modal to open before clearing success message to prevent visual overlay shifts
    await delay(200);
    setSuccessMessage("");
  };

  const closeTaskUpdateModal = async () => {
    // Wait for the modal close animation to finish before unmounting the component to prevent animation jank
    await delay(200);
    setIsTaskUpdateOpen(false);
  };

  useEffect(() => {
    taskUpdateModalRef.current?.showModal();
  }, [isTaskUpdateOpen]);

  return (
    <>
      <FormModal dialogRef={dialogRef} onClose={onClose}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2.5 text-sm font-bold">
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
          <div>
            <h2 className="mb-2.5 text-lg font-bold">{task.title}</h2>
            <p className="text-slate-500">{task.description}</p>
          </div>
          {successMessage && (
            <div className="w-full">
              <p className="rounded-lg bg-green-600 px-3 py-2 text-center text-sm text-white">
                {successMessage}
              </p>
            </div>
          )}
          <div>
            <button
              onClick={openTaskUpdateModal}
              className="btn focus:outline-accent w-full gap-2.5 rounded-lg border-none bg-pink-200 p-2.5 text-rose-600 hover:bg-pink-300"
            >
              Edit task <img src={editTask} alt="" />
            </button>
          </div>
        </div>
      </FormModal>
      {isTaskUpdateOpen &&
        createPortal(
          <TaskUpdateModal
            workspaceId={workspaceId}
            task={task}
            setSuccessMessage={setSuccessMessage}
            dialogRef={taskUpdateModalRef}
            onClose={closeTaskUpdateModal}
          />,
          document.body,
        )}
    </>
  );
}

export default TaskDetailsModal;
