import { useState, type SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { workspaceColumnUpdateTitleMutationOptions } from "@hooks/queryOptions";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import {
  WorkspaceColumnTitleUpdateSchema,
  type WorkspaceColumnResponse,
} from "@customTypes/workspaceColumn";
import { AppError } from "@customTypes/appError";
import FormModal from "@components/FormModal";
import { toast } from "react-toastify";
import save from "@images/save.svg";

type Props = {
  workspaceId: string;
  workspaceColumn: WorkspaceColumnResponse;
};

const EDIT_WORKSPACE_COLUMN_MODAL_ID = "edit_workspace_column_dialog";
const FORM_ID = "edit_workspace_column_form";

function WorkspaceColumnEditModal({ workspaceId, workspaceColumn }: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const handleExpiredSession = useHandleExpiredSession();
  const {
    mutateAsync: workspaceColumnUpdateTitleMutation,
    isPending: isUpdating,
  } = useMutation(workspaceColumnUpdateTitleMutationOptions());

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("workspaceId", workspaceId);
    formData.append("workspaceColumnId", String(workspaceColumn.id));
    const data = Object.fromEntries(formData);
    // We need to convert numbers before validation, since form data is always string values
    const dataToParse = {
      workspaceId: Number(data.workspaceId),
      workspaceColumnId: Number(data.workspaceColumnId),
      title: data.title,
    };

    // Validation
    const result = WorkspaceColumnTitleUpdateSchema.safeParse(dataToParse);
    if (result.error) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    // Form submission
    try {
      const payload = { ...result.data, title: result.data.title.trim() };
      await workspaceColumnUpdateTitleMutation(payload);
      form.reset();
      const modal = document.getElementById(
        EDIT_WORKSPACE_COLUMN_MODAL_ID,
      ) as HTMLDialogElement;
      modal.close();
      toast.success("Column updated successfully!");
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 401:
            await handleExpiredSession();
            break;
          case 403:
            setErrorMessage(
              "You don't have permission to edit columns in this workspace.",
            );
            break;
          case 400:
            setErrorMessage(
              "Something went wrong while editing the column. Please try again.",
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
    <FormModal id={EDIT_WORKSPACE_COLUMN_MODAL_ID} onClose={resetForm}>
      <h2 className="mb-6 text-center text-lg font-bold">Edit column</h2>
      <form
        id={FORM_ID}
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-6"
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
            defaultValue={workspaceColumn.title}
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
              Updating column...
            </p>
          </div>
        )}
        <button
          disabled={isUpdating}
          className="btn btn-primary gap-2.5 rounded-lg"
        >
          <p>
            Save <span className="xs:inline hidden">changes</span>
          </p>
          <img src={save} />
        </button>
      </form>
    </FormModal>
  );
}

export default WorkspaceColumnEditModal;
