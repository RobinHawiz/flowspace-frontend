import { useState, type SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { workspaceCreationMutationOptions } from "@hooks/queryOptions";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import { workspaceCreationSchema } from "@customTypes/workspace";
import { AppError } from "@customTypes/appError";
import FormModal from "@components/FormModal";

const CREATE_WORKSPACE_MODAL_ID = "create_workspace_dialog";
const FORM_ID = "create_workspace_form";

function WorkspaceCreateModal() {
  const [errorMessage, setErrorMessage] = useState("");
  const handleExpiredSession = useHandleExpiredSession();
  const { mutateAsync: workspaceCreationMutation, isPending: isLoading } =
    useMutation(workspaceCreationMutationOptions());

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validation
    const result = workspaceCreationSchema.safeParse(data);
    if (result.error) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    // Form submission
    try {
      const payload = { title: result.data.title.trim() };
      await workspaceCreationMutation(payload);
      form.reset();
      const modal = document.getElementById(
        CREATE_WORKSPACE_MODAL_ID,
      ) as HTMLDialogElement;
      modal.close();
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

  const resetForm = () => {
    setErrorMessage("");
    const form = document.getElementById(FORM_ID) as HTMLFormElement;
    form.reset();
  };

  return (
    <FormModal id={CREATE_WORKSPACE_MODAL_ID} onClose={resetForm}>
      <h2 className="mb-6 text-center text-lg font-bold">Create a workspace</h2>
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
        {isLoading && (
          <div className="flex-center flex-col">
            <span className="loading loading-spinner text-accent w-8 sm:w-12"></span>
            <p className="text-accent mt-2 block text-sm sm:text-base">
              Creating workspace...
            </p>
          </div>
        )}
        <button
          className="btn btn-primary gap-2.5 rounded-lg"
          type="submit"
          disabled={isLoading}
        >
          Create Workspace
        </button>
      </form>
    </FormModal>
  );
}

export default WorkspaceCreateModal;
