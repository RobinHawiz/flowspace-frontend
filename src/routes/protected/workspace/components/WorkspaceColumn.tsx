import type { WorkspaceColumnResponse } from "@customTypes/workspaceColumn";

type Props = {
  workspaceColumn: WorkspaceColumnResponse;
};

function WorkspaceColumn({ workspaceColumn }: Props) {
  return (
    <div className="border-accent w-full max-w-70 rounded-lg border border-solid bg-white/28 p-2.5 shadow-md backdrop-blur-sm">
      <h2 className="mb-3 pl-2.5 text-lg font-bold">{workspaceColumn.title}</h2>
      {/* Placeholder task content, replace with actual tasks when implemented. */}
      <ul className="flex flex-col gap-3">
        <li className="rounded-lg border-l-3 border-solid border-red-500 bg-white p-2.5 shadow-sm">
          Fix UI bugs
        </li>
        <li className="rounded-lg border-l-3 border-solid border-yellow-500 bg-white p-2.5 shadow-sm">
          Optimize images and assets
        </li>
        <li className="rounded-lg border-l-3 border-solid border-green-500 bg-white p-2.5 shadow-sm">
          Check accessibility issues
        </li>
      </ul>
    </div>
  );
}

export default WorkspaceColumn;
