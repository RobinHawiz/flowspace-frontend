import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import {
  workspaceDeleteMutationOptions,
  workspaceEditMutationOptions,
} from "@hooks/queryOptions";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import { workspaceUpdateSchema } from "@customTypes/workspace";
import { AppError } from "@customTypes/appError";
import FormModal from "@components/FormModal";
import { toast } from "react-toastify";
import save from "@images/save.svg";
import deleteIcon from "@images/delete.svg";

type Props = {
  workspaceId: string;
};

const EDIT_WORKSPACE_MODAL_ID = "edit_workspace_dialog";
const FORM_ID = "edit_workspace_form";

function WorkspaceEditModal({ workspaceId }: Props) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const handleExpiredSession = useHandleExpiredSession();
  const { mutateAsync: workspaceEditMutation, isPending: isUpdating } =
    useMutation(workspaceEditMutationOptions());
  const { mutateAsync: workspaceDeleteMutation, isPending: isDeleting } =
    useMutation(workspaceDeleteMutationOptions());

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("id", workspaceId);
    const data = Object.fromEntries(formData);
    // We need to convert the id to a number before validation, since form data is always string values
    const dataToParse = { id: Number(data.id), title: data.title };

    // Validation
    const result = workspaceUpdateSchema.safeParse(dataToParse);
    if (result.error) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    // Form submission
    try {
      const payload = { id: result.data.id, title: result.data.title.trim() };
      await workspaceEditMutation(payload);
      form.reset();
      const modal = document.getElementById(
        EDIT_WORKSPACE_MODAL_ID,
      ) as HTMLDialogElement;
      modal.close();
      toast.success("Workspace updated successfully!");
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 401:
            await handleExpiredSession();
            break;
          case 400:
            setErrorMessage(
              "Something went wrong while submitting the form. Please try again.",
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workspace? This action cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      await workspaceDeleteMutation(Number(workspaceId));
      const modal = document.getElementById(
        EDIT_WORKSPACE_MODAL_ID,
      ) as HTMLDialogElement;
      modal.close();
      toast.success("Workspace deleted successfully!");
      navigate("/workspaces");
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 401:
            await handleExpiredSession();
            break;
          case 403:
            setErrorMessage(
              "You don't have permission to delete this workspace.",
            );
            break;
          case 400:
            setErrorMessage(
              "Something went wrong while deleting the workspace. Please try again.",
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
    <FormModal id={EDIT_WORKSPACE_MODAL_ID} onClose={resetForm}>
      <h2 className="mb-6 text-center text-lg font-bold">Edit workspace</h2>
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
          />
        </div>
        {errorMessage && (
          <div className="w-full">
            <p className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white">
              * {errorMessage}
            </p>
          </div>
        )}
        {(isUpdating || isDeleting) && (
          <div className="flex-center flex-col">
            <span className="loading loading-spinner text-accent w-8 sm:w-12"></span>
            <p className="text-accent mt-2 block text-sm sm:text-base">
              {isUpdating ? "Updating workspace..." : "Deleting workspace..."}
            </p>
          </div>
        )}
        <div className="flex gap-4">
          <button
            type="button"
            disabled={isUpdating || isDeleting}
            onClick={handleDelete}
            className="btn btn-primary flex-1 gap-2.5 rounded-lg border-none bg-red-200 text-red-500 focus:outline-red-500"
          >
            Delete <img src={deleteIcon} />
          </button>
          <button
            disabled={isUpdating || isDeleting}
            className="btn btn-primary flex-1 gap-2.5 rounded-lg"
          >
            Save changes <img src={save} />
          </button>
        </div>
      </form>
    </FormModal>
  );
}

export default WorkspaceEditModal;
