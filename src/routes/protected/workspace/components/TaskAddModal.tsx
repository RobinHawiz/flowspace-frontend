import { useState, type SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { taskAddMutationOptions } from "@hooks/queryOptions";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import { taskCreationSchema } from "@customTypes/task";
import { AppError } from "@customTypes/appError";
import FormModal from "@components/FormModal";
import { toast } from "react-toastify";
import addTaskModal from "@images/add-task-modal.svg";

type Props = {
  workspaceId: string;
  workspaceColumnId: number;
  taskOrder: number;
};

const ADD_TASK_MODAL_ID = "add_task_dialog";
const FORM_ID = "add_task_form";

function TaskAddModal({ workspaceId, workspaceColumnId, taskOrder }: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const handleExpiredSession = useHandleExpiredSession();
  const { mutateAsync: taskAddMutation, isPending: isAdding } = useMutation(
    taskAddMutationOptions(),
  );

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("workspaceId", workspaceId);
    formData.append("workspaceColumnId", String(workspaceColumnId));
    formData.append("taskOrder", String(taskOrder));
    const data = Object.fromEntries(formData);
    // We need to convert numbers, strings and nullable values before validation, since form data is always string values
    const dataToParse = {
      workspaceId: Number(data.workspaceId),
      workspaceColumnId: Number(data.workspaceColumnId),
      title: data.title,
      description: data.description ? data.description : null,
      priority: data.priority,
      deadline: data.deadline
        ? new Date(String(data.deadline)).toISOString()
        : null,
      taskOrder: Number(data.taskOrder),
    };

    const result = taskCreationSchema.safeParse(dataToParse);
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
      await taskAddMutation(payload);
      form.reset();
      const modal = document.getElementById(
        ADD_TASK_MODAL_ID,
      ) as HTMLDialogElement;
      modal.close();
      toast.success("Task added successfully!");
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 401:
            await handleExpiredSession();
            break;
          case 403:
            setErrorMessage(
              "You don't have permission to add tasks to this workspace.",
            );
            break;
          case 400:
            setErrorMessage(
              "Something went wrong while adding the task. Please try again.",
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

  const resetForm = () => {
    setErrorMessage("");
    const form = document.getElementById(FORM_ID) as HTMLFormElement;
    form.reset();
  };

  return (
    <FormModal id={ADD_TASK_MODAL_ID} onClose={resetForm}>
      <h2 className="mb-6 text-center text-lg font-bold">Add task</h2>
      <form
        id={FORM_ID}
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label className="self-start text-base font-medium" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
            type="text"
            name="title"
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
            defaultValue="low"
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
          />
        </div>
        {errorMessage && (
          <div className="w-full">
            <p className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white">
              * {errorMessage}
            </p>
          </div>
        )}
        {isAdding && (
          <div className="flex-center flex-col">
            <span className="loading loading-spinner text-accent w-8 sm:w-12"></span>
            <p className="text-accent mt-2 block text-sm sm:text-base">
              Adding task...
            </p>
          </div>
        )}
        <button
          disabled={isAdding}
          className="btn btn-primary gap-2.5 rounded-lg"
        >
          Add task <img src={addTaskModal} />
        </button>
      </form>
    </FormModal>
  );
}

export default TaskAddModal;
