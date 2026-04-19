import type { WorkspaceMembersResponse } from "@customTypes/workspace";
import { appUserQueryOptions } from "@hooks/queryOptions";
import members from "@images/members.svg";
import MemberItem from "@protectedRoutes/workspace/components/MemberItem";
import { useQuery } from "@tanstack/react-query";

const MEMBERS_DROPDOWN_ID = "members-dropdown";

type Props = {
  workspaceId: number;
  workspaceMembers: Array<WorkspaceMembersResponse>;
};

function MembersDropdown({ workspaceId, workspaceMembers }: Props) {
  const { data: currentAppUser } = useQuery(appUserQueryOptions());

  const currentAppUserRole = workspaceMembers.find(
    (member) => member.id === currentAppUser?.id,
  )?.role;
  if (!currentAppUser || !currentAppUserRole) return null;

  return (
    <>
      <button
        className="btn focus:outline-accent gap-2.5 rounded-lg border-none bg-white p-2.5 hover:bg-slate-100"
        style={{ anchorName: "--anchor-members" }}
        popoverTarget={MEMBERS_DROPDOWN_ID}
      >
        <img src={members} />
        <p className="mr-auto">Members</p>
      </button>
      <ul
        className="dropdown menu bg-base-100 rounded-box mt-1 w-70 shadow-sm"
        popover="auto"
        id={MEMBERS_DROPDOWN_ID}
        style={{ positionAnchor: "--anchor-members" }}
      >
        {workspaceMembers.map((member) => (
          <li key={member.id}>
            <MemberItem
              currentAppUserId={currentAppUser.id}
              currentAppUserRole={currentAppUserRole}
              member={member}
              workspaceId={workspaceId}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

export default MembersDropdown;
