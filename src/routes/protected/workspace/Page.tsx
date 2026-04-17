import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import WorkspaceEditModal from "@protectedRoutes/workspace/components/WorkspaceEditModal";
import DrawerMenu from "@components/DrawerMenu";
import { workspaceQueryOptions } from "@hooks/queryOptions";

const EDIT_WORKSPACE_MODAL_ID = "edit_workspace_dialog";

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
  const { data: workspace, isFetching } = useQuery(
    workspaceQueryOptions(Number(workspaceId!)),
  );

  const openEditWorkspaceModal = () => {
    const modal = document.getElementById(
      EDIT_WORKSPACE_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  return (
    <DrawerMenu
      workspace={workspace}
      isLoading={isFetching}
      openEditWorkspaceModal={openEditWorkspaceModal}
    >
      <div className="flex-center bg-gradient min-h-[90svh]">
        {isFetching ? (
          <div className="skeleton h-64 w-64 shadow-lg"></div>
        ) : (
          <></>
        )}
      </div>
      <WorkspaceEditModal workspaceId={workspaceId!} />
    </DrawerMenu>
  );
}
