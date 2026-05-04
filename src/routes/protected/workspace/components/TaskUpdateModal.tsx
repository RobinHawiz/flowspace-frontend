import {
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  type SubmitEvent,
} from "react";
import { useMutation } from "@tanstack/react-query";
import FormModal from "@components/FormModal";
import { AppError } from "@customTypes/appError";
import { taskUpdateSchema, type TaskResponse } from "@customTypes/task";
import { taskUpdateMutationOptions } from "@hooks/queryOptions";
import save from "@images/save.svg";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";

type Props = {
  workspaceId: number;
  task: TaskResponse;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => Promise<void>;
};

function TaskUpdateModal({
  workspaceId,
  task,
  setSuccessMessage,
  dialogRef,
  onClose,
}: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const handleExpiredSession = useHandleExpiredSession();
  const { mutateAsync: taskUpdateMutation, isPending: isUpdating } =
    useMutation(taskUpdateMutationOptions());

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("workspaceId", String(workspaceId));
    formData.append("taskId", String(task.id));
    const data = Object.fromEntries(formData);
    // We need to convert numbers, strings and nullable values before validation, since form data is always string values
    const dataToParse = {
      workspaceId: Number(data.workspaceId),
      taskId: Number(data.taskId),
      title: data.title,
      description: data.description ? data.description : null,
      priority: data.priority,
      deadline: data.deadline
        ? new Date(String(data.deadline)).toISOString()
        : null,
    };

    const result = taskUpdateSchema.safeParse(dataToParse);
    if (result.error) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    try {
      const payload = {
        ...result.data,
        title: result.data.title.trim(),
        description: result.data.description?.trim() || null,
      };
      await taskUpdateMutation(payload);
      setSuccessMessage("Task updated successfully!");
      dialogRef.current?.close();
      await onClose();
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 401:
            await handleExpiredSession();
            break;
          case 403:
            setErrorMessage(
              "You don't have permission to edit tasks in this workspace.",
            );
            break;
          case 400:
            setErrorMessage(
              "Something went wrong while updating the task. Please try again.",
            );
            break;
          default:
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
        console.error(err.message);
      } else {
        const errorMessage = getUnexpectedFormErrorMessage(err);
        setErrorMessage(errorMessage);
      }
    }
  };

  return (
    <FormModal dialogRef={dialogRef} onClose={onClose}>
      <h2 className="mb-6 text-center text-lg font-bold">Edit task</h2>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="self-start text-base font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
            type="text"
            name="title"
            defaultValue={task.title}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="self-start text-base font-medium"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
            name="description"
            rows={4}
            defaultValue={task.description ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="self-start text-base font-medium"
            htmlFor="priority"
          >
            Priority
          </label>
          <select
            id="priority"
            className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
            name="priority"
            defaultValue={task.priority}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label
            className="self-start text-base font-medium"
            htmlFor="deadline"
          >
            Deadline
          </label>
          <input
            id="deadline"
            className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
            type="date"
            name="deadline"
            defaultValue={task.deadline?.split("T")[0] ?? ""}
          />
        </div>
        {errorMessage && (
          <div className="w-full">
            <p className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white">
              * {errorMessage}
            </p>
          </div>
        )}
        {isUpdating && (
          <div className="flex-center flex-col">
            <span className="loading loading-spinner text-accent w-8 sm:w-12"></span>
            <p className="text-accent mt-2 block text-sm sm:text-base">
              Updating task...
            </p>
          </div>
        )}
        <button
          disabled={isUpdating}
          className="btn btn-primary gap-2.5 rounded-lg"
        >
          Save changes <img src={save} />
        </button>
      </form>
    </FormModal>
  );
}

export default TaskUpdateModal;
