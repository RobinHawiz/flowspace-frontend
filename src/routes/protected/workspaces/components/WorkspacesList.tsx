import { useQuery } from "@tanstack/react-query";
import { workspacesQueryOptions } from "@hooks/queryOptions";
import WorkspaceCard from "@protectedRoutes/workspaces/components/WorkspaceCard";
import createWorkspace from "@images/create-workspace.svg";
import empty from "@images/empty.svg";

function WorkspacesList() {
  const { data: workspaces, isFetching } = useQuery(workspacesQueryOptions());

  return (
    <>
      {isFetching ? (
        <div className="flex-center shadow-elevation-high mb-[10svh] flex-col rounded-lg bg-white/40 px-6 py-8">
          <span className="loading loading-spinner text-accent w-8 sm:w-12"></span>
          <p className="text-accent mt-2 block text-xl font-bold">
            Loading workspaces...
          </p>
        </div>
      ) : (
        <section className="flex-center shadow-elevation-high xs:gap-7.5 mb-[10svh] w-9/10 max-w-212.5 flex-col gap-5 rounded-lg bg-white/40 px-8 py-11">
          {workspaces && workspaces.length > 0 ? (
            <>
              <h1 className="xs:text-5xl text-center text-3xl font-bold text-black">
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

              <h1 className="xs:text-5xl text-center text-3xl font-bold text-black">
                No workspaces yet.
              </h1>
              <p className="xs:text-base text-center text-sm font-medium text-slate-700">
                Create your first board to start managing your project and tasks
                in one space.
              </p>
            </>
          )}
          <button className="btn btn-primary gap-2.5 rounded-lg">
            Create Workspace <img src={createWorkspace} />
          </button>
        </section>
      )}
    </>
  );
}

export default WorkspacesList;
