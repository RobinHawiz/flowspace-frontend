import { useState, type SubmitEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { workspaceMembersAddMutationOptions } from "@hooks/queryOptions";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import { workspaceMembersAddSchema } from "@customTypes/workspace";
import { AppError } from "@customTypes/appError";
import FormModal from "@components/FormModal";
import { toast } from "react-toastify";
import addMemberModal from "@images/add-member-modal.svg";

type Props = {
  workspaceId: string;
};

const ADD_MEMBER_MODAL_ID = "add_member_dialog";
const FORM_ID = "add_member_form";

function MemberAddModal({ workspaceId }: Props) {
  const [errorMessage, setErrorMessage] = useState("");
  const handleExpiredSession = useHandleExpiredSession();
  const { mutateAsync: workspaceMembersAddMutation, isPending: isAdding } =
    useMutation(workspaceMembersAddMutationOptions());

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("workspaceId", workspaceId);
    const data = Object.fromEntries(formData);
    // We need to convert the id to a number before validation, since form data is always string values
    const dataToParse = {
      workspaceId: Number(data.workspaceId),
      email: data.email,
    };

    // Validation
    const result = workspaceMembersAddSchema.safeParse(dataToParse);
    if (result.error) {
      setErrorMessage(result.error.issues[0].message);
      return;
    }

    // Form submission
    try {
      const payload = result.data;
      await workspaceMembersAddMutation(payload);
      form.reset();
      const modal = document.getElementById(
        ADD_MEMBER_MODAL_ID,
      ) as HTMLDialogElement;
      modal.close();
      toast.success("Member added successfully!");
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 401:
            await handleExpiredSession();
            break;
          case 403:
            setErrorMessage(
              "You don't have permission to add members to this workspace.",
            );
            break;
          case 404:
            setErrorMessage("The member with that email does not exist.");
            break;
          case 409:
            setErrorMessage("That user is already a member of the workspace.");
            break;
          case 400:
            setErrorMessage(
              "Something went wrong while adding the member. Please try again.",
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
    <FormModal id={ADD_MEMBER_MODAL_ID} onClose={resetForm}>
      <h2 className="mb-6 text-center text-lg font-bold">Add member</h2>
      <form
        id={FORM_ID}
        onSubmit={(e) => handleSubmit(e)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-1">
          <label className="self-start text-base font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="focus:border-accent w-full rounded-lg border border-solid border-slate-500 px-4 py-2 text-sm transition-colors duration-200 ease-in-out focus:outline-none"
            type="text"
            name="email"
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
              Adding member...
            </p>
          </div>
        )}
        <button
          disabled={isAdding}
          className="btn btn-primary gap-2.5 rounded-lg"
        >
          Add member <img src={addMemberModal} />
        </button>
      </form>
    </FormModal>
  );
}

export default MemberAddModal;
