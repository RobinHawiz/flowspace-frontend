import WorkspacesList from "@protectedRoutes/workspaces/components/WorkspacesList";

export function ErrorBoundary() {
  return (
    <div className="flex-center bg-gradient min-h-[90svh] px-4">
      <section className="shadow-elevation-high mb-[10svh] w-full max-w-md rounded-lg bg-red-500 px-6 py-8 text-center text-white">
        <h1 className="mb-2 text-xl font-bold">
          We couldn't load your workspaces
        </h1>
        <p className="text-sm">
          Something went wrong while loading this page. Please try again in a
          moment.
        </p>
      </section>
    </div>
  );
}

export function Component() {
  return (
    <div className="flex-center bg-gradient min-h-[90svh]">
      <WorkspacesList />
    </div>
  );
}
