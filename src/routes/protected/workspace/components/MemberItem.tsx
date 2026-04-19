import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import type { WorkspaceMembersResponse } from "@customTypes/workspace";
import { workspaceMembersRemoveMutationOptions } from "@hooks/queryOptions";
import useHandleExpiredSession from "@hooks/useHandleExpiredSession";
import { AppError } from "@customTypes/appError";
import getUnexpectedFormErrorMessage from "@utils/getUnexpectedFormErrorMessage";
import removeMember from "@images/remove-member.svg";
import admin from "@images/admin.svg";

type MemberItemProps = {
  currentAppUserId: number;
  currentAppUserRole: string;
  member: WorkspaceMembersResponse;
  workspaceId: number;
};

function MemberItem({
  currentAppUserId,
  currentAppUserRole,
  member,
  workspaceId,
}: MemberItemProps) {
  const navigate = useNavigate();
  const handleExpiredSession = useHandleExpiredSession();
  const { mutateAsync: workspaceMembersRemoveMutation, isPending: isRemoving } =
    useMutation(workspaceMembersRemoveMutationOptions());
  const isCurrentUser = currentAppUserId === member.id;

  const handleRemoveMember = async () => {
    try {
      await workspaceMembersRemoveMutation({
        workspaceId,
        appUserId: member.id,
      });
      if (isCurrentUser && member.role === "member") {
        toast.success("You've removed yourself from the workspace.");
        navigate("/workspaces");
      } else {
        toast.success("Member removed successfully!");
      }
    } catch (err) {
      if (err instanceof AppError) {
        switch (err.statusCode) {
          case 401:
            await handleExpiredSession();
            break;
          case 403:
            if (isCurrentUser && currentAppUserRole === "admin") {
              toast.error(
                "You cannot remove yourself as an admin from the workspace.",
              );
            } else if (
              currentAppUserRole === "admin" &&
              member.role === "admin"
            ) {
              toast.error(
                "You cannot remove another admin from the workspace.",
              );
            } else {
              toast.error(
                "You don't have permission to remove members in this workspace.",
              );
            }
            break;
          case 404:
            toast.error("The member you tried to remove does not exist.");
            break;
          case 400:
            toast.error(
              "Something went wrong while removing the member. Please try again.",
            );
            break;
          default:
            toast.error("An unexpected error occurred. Please try again.");
        }
        console.error(err.message);
      } else {
        const errorMessage = getUnexpectedFormErrorMessage(err);
        toast.error(errorMessage);
      }
    }
  };
  return (
    <>
      {isRemoving ? (
        <div className="skeleton pointer-events-none h-11 w-full animate-pulse rounded-lg"></div>
      ) : (
        <button
          disabled={isRemoving}
          onClick={handleRemoveMember}
          className="flex rounded-lg"
        >
          <span className="flex-center flex h-8 w-8 rounded-full bg-pink-200 font-bold text-rose-600">
            {member.firstName[0]}
            {member.lastName[0]}
          </span>
          {member.role === "admin" && <img src={admin} alt="" />}
          <p className="font-bold">
            {member.firstName} {member.lastName} {isCurrentUser && "(You)"}
          </p>
          <img className="ml-auto" src={removeMember} alt="" />
        </button>
      )}
    </>
  );
}

export default MemberItem;
