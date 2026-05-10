import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSocket } from "@contexts/SocketProvider";
import { workspacesQueryOptions } from "@cache/queryOptions";
import WorkspaceCard from "@protectedRoutes/workspaces/components/WorkspaceCard";
import createWorkspace from "@images/create-workspace.svg";
import empty from "@images/empty.svg";
import WorkspaceCreateModal from "@protectedRoutes/workspaces/components/WorkspaceCreateModal";

const CREATE_WORKSPACE_MODAL_ID = "create_workspace_dialog";

function WorkspacesList() {
  const { data: workspaces, isFetching } = useQuery(workspacesQueryOptions());

  const openCreateWorkspaceModal = () => {
    const modal = document.getElementById(
      CREATE_WORKSPACE_MODAL_ID,
    ) as HTMLDialogElement;
    modal.showModal();
  };

  const { socket, isConnected } = useSocket();
  const workspaceIds = workspaces?.map((workspace) => workspace.id) || [];

  useEffect(() => {
    if (!socket || !isConnected || workspaceIds.length === 0) return;
    workspaceIds.forEach((workspaceId) => {
      socket.emit("workspace:join", workspaceId);
    });

    function handleJoinError(error: unknown) {
      console.error("Error joining workspace room", error);
    }

    socket.on("workspace:join_error", handleJoinError);

    return () => {
      socket.off("workspace:join_error", handleJoinError);
    };
    // Use a serialized dependency because arrays are compared by reference and would cause the effect to run on every render, regardless of whether the array contents have changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, JSON.stringify(workspaceIds)]);

  return (
    <>
      {isFetching ? (
        <div className="skeleton mb-[10svh] h-64 w-9/10 max-w-212.5 shadow-lg"></div>
      ) : (
        <section className="flex-center shadow-elevation-high xs:gap-7.5 mb-[10svh] w-9/10 max-w-212.5 flex-col gap-5 rounded-lg bg-white/40 px-8 py-11">
          {workspaces && workspaces.length > 0 ? (
            <>
              <h1 className="xs:text-5xl text-center text-3xl font-bold">
                Your workspaces
              </h1>
              <ul>
                {workspaces.map((workspace) => (
                  <li key={workspace.id}>
                    <WorkspaceCard {...workspace} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div>
                <img
                  src={empty}
                  alt="No workspaces"
                  className="xs:w-full mx-auto w-2/3"
                />
              </div>

              <h1 className="xs:text-5xl text-center text-3xl font-bold">
                No workspaces yet.
              </h1>
              <p className="xs:text-base text-center text-sm font-medium text-slate-700">
                Create your first board to start managing your project and tasks
                in one space.
              </p>
            </>
          )}
          <button
            onClick={openCreateWorkspaceModal}
            className="btn btn-primary gap-2.5 rounded-lg"
          >
            Create Workspace <img src={createWorkspace} />
          </button>
        </section>
      )}
      <WorkspaceCreateModal />
    </>
  );
}

export default WorkspacesList;
