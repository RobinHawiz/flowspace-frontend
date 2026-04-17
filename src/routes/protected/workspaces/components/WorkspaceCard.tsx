import { Link } from "react-router-dom";
import type { WorkspaceResponse } from "@customTypes/workspace";
import workspace from "@images/workspace.svg";

type Props = WorkspaceResponse;

function WorkspaceCard({ id, title }: Props) {
  return (
    <article className="btn relative flex items-center justify-between rounded-lg border-none bg-white px-4 py-2.5 shadow-sm hover:bg-slate-100">
      <div className="flex gap-2.5">
        <img src={workspace} alt="" />
        <h2 className="xs:text-xl text-lg font-bold">{title}</h2>
      </div>
      <Link
        to={`/workspaces/${id}`}
        aria-label={`View ${title} workspace page`}
        draggable={false}
        className="focus-visible:outline-accent absolute top-0 left-0 h-full w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
      ></Link>
    </article>
  );
}

export default WorkspaceCard;
