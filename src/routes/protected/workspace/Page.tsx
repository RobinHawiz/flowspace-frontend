import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import WorkspaceEditModal from "@protectedRoutes/workspace/components/WorkspaceEditModal";
import DrawerMenu from "@components/DrawerMenu";
import {
  workspaceMembersQueryOptions,
  workspaceQueryOptions,
} from "@hooks/queryOptions";
import MemberAddModal from "@protectedRoutes/workspace/components/MemberAddModal";

const EDIT_WORKSPACE_MODAL_ID = "edit_workspace_dialog";
const ADD_MEMBER_MODAL_ID = "add_member_dialog";

export function ErrorBoundary() {
  return (
    <DrawerMenu>
      <div className="flex-center bg-gradient min-h-[90svh] px-4">
        <section className="shadow-elevation-high mb-[10svh] w-full max-w-md rounded-lg bg-red-500 px-6 py-8 text-center text-white">
          <h1 className="mb-2 text-xl font-bold">
            We couldn't load your workspace
          </h1>
          <p className="text-sm">
            Something went wrong while loading this page. Please try again in a
            moment.
          </p>
        </section>
      </div>
    </DrawerMenu>
  );
}

export function Component() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspace, isFetching: isFetchingWorkspace } = useQuery(
    workspaceQueryOptions(Number(workspaceId!)),
  );
  const { data: workspaceMembers, isFetching: isFetchingWorkspaceMembers } =
    useQuery(workspaceMembersQueryOptions(Number(workspaceId!)));

  const openEditWorkspaceModal = () => {
    const modal = document.getElementById(
      EDIT_WORKSPACE_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const openAddWorkspaceMembersModal = () => {
    const modal = document.getElementById(
      ADD_MEMBER_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  return (
    <DrawerMenu
      workspace={workspace}
      workspaceMembers={workspaceMembers}
      isLoading={isFetchingWorkspace || isFetchingWorkspaceMembers}
      openEditWorkspaceModal={openEditWorkspaceModal}
      openAddWorkspaceMembersModal={openAddWorkspaceMembersModal}
    >
      <div className="flex-center bg-gradient min-h-[90svh]">
        {isFetchingWorkspace || isFetchingWorkspaceMembers ? (
          <div className="skeleton h-64 w-64 shadow-lg"></div>
        ) : (
          <></>
        )}
      </div>
      <WorkspaceEditModal workspaceId={workspaceId!} />
      <MemberAddModal workspaceId={workspaceId!} />
    </DrawerMenu>
  );
}
