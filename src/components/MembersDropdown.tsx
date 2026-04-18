import type { WorkspaceMembersResponse } from "@customTypes/workspace";
import members from "@images/members.svg";
import removeMember from "@images/remove-member.svg";

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
            <button className="rounded-lg">
              <span className="text-accent flex-center border-accent flex h-8 w-8 rounded-full border-2 border-solid bg-pink-100 font-bold">
                {member.firstName[0]}
                {member.lastName[0]}
              </span>
              <p className="font-bold">
                {member.firstName} {member.lastName}
              </p>
              <img src={removeMember} alt="" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default MembersDropdown;
