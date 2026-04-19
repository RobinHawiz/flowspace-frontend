import type { WorkspaceMembersResponse } from "@customTypes/workspace";
import members from "@images/members.svg";
import removeMember from "@images/remove-member.svg";
import admin from "@images/admin.svg";

const MEMBERS_DROPDOWN_ID = "members-dropdown";

type Props = {
  workspaceMembers: Array<WorkspaceMembersResponse>;
};

function MembersDropdown({ workspaceMembers }: Props) {
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
        className="dropdown menu bg-base-100 rounded-box mt-1 w-65 shadow-sm"
        popover="auto"
        id={MEMBERS_DROPDOWN_ID}
        style={{ positionAnchor: "--anchor-members" }}
      >
        {workspaceMembers.map((member) => (
          <li key={member.id}>
            <button className="flex rounded-lg">
              <span className="flex-center flex h-8 w-8 rounded-full bg-pink-200 font-bold text-rose-600">
                {member.firstName[0]}
                {member.lastName[0]}
              </span>
              {member.role === "admin" && <img src={admin} alt="" />}
              <p className="font-bold">
                {member.firstName} {member.lastName}
              </p>
              <img className="ml-auto" src={removeMember} alt="" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default MembersDropdown;
