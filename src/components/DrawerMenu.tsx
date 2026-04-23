import { useState, type PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@contexts/AuthProvider";
import MembersDropdown from "@protectedRoutes/workspace/components/MembersDropdown";
import type {
  WorkspaceMembersResponse,
  WorkspaceResponse,
} from "@customTypes/workspace";
import openMenu from "@images/open-menu.svg";
import closeMenu from "@images/close-menu.svg";
import logOut from "@images/log-out.svg";
import edit from "@images/edit.svg";
import addMember from "@images/add-member.svg";
import addMemberDrawer from "@images/add-member-drawer.svg";
import logo from "@images/logo.svg";
import delay from "@utils/delay";

const MEMBERS_DROPDOWN_ID = "members-dropdown";

interface DrawerMenuProps extends PropsWithChildren {
  workspace?: WorkspaceResponse;
  workspaceMembers?: Array<WorkspaceMembersResponse>;
  isLoading?: boolean;
  openEditWorkspaceModal?: () => void;
  openAddWorkspaceMembersModal?: () => void;
}

function DrawerMenu({
  children,
  workspace,
  workspaceMembers,
  isLoading,
  openEditWorkspaceModal,
  openAddWorkspaceMembersModal,
}: DrawerMenuProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const toggleDrawer = async () => {
    const elemToFocus = checked ? ".drawer-toggle" : "#drawer-side-btn";
    setChecked(!checked);
    const elem = document.querySelector<HTMLElement>(elemToFocus);
    // Wait for the drawer to open before focusing the button, otherwise it won't work before the drawer has begun opening.
    if (!checked) await delay(200);
    elem?.focus();
    closeMembersDropdown();
  };

  const closeMembersDropdown = () => {
    const dropdown = document.getElementById(
      MEMBERS_DROPDOWN_ID,
    ) as HTMLElement | null;
    dropdown?.hidePopover();
  };

  const logoutUser = async () => {
    await logout();
    navigate("/");
    toast.info("You've successfully logged out.");
  };

  return (
    <div className="drawer z-10 min-h-svh">
      <input
        id="my-drawer-5"
        type="checkbox"
        checked={checked}
        onChange={toggleDrawer}
        disabled={isLoading}
        className="drawer-toggle"
      />
      <div className="drawer-content relative">
        <header className="relative flex min-h-[10svh] items-center gap-2.5 px-10 py-3">
          <nav>
            <label
              id="drawer-content-btn"
              htmlFor="my-drawer-5"
              className="btn drawer-button text-accent border-none not-hover:bg-transparent"
            >
              <img src={openMenu} className="min-w-5.5" />
            </label>
          </nav>
          {workspace !== undefined || isLoading ? (
            <h1 className="xs:text-2xl text-xl font-bold">
              {workspace?.title || <div className="skeleton h-4 w-28"></div>}
            </h1>
          ) : (
            <div className="xs:absolute xs:top-1/2 xs:left-1/2 xs:-translate-x-1/2 xs:-translate-y-1/2 mx-auto">
              <img src={logo} alt="Flowspace logo" />
            </div>
          )}
          {workspaceMembers && openAddWorkspaceMembersModal && (
            <button
              className="xs:flex btn focus:outline-accent ml-auto hidden gap-2.5 rounded-lg border-none bg-pink-200 p-2.5 text-rose-600 hover:bg-pink-300"
              onClick={openAddWorkspaceMembersModal}
            >
              <p className="mr-auto">Add member</p>
              <img src={addMember} />
            </button>
          )}
        </header>
        {/* Page content */}
        {children}
      </div>
      <nav className="drawer-side">
        <label
          htmlFor="my-drawer-5"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 flex min-h-full w-80 flex-col gap-2 p-4 font-bold">
          {/* Sidebar content here */}
          <li className="inline">
            <button
              id="drawer-side-btn"
              className="btn focus:outline-accent border-none not-hover:bg-transparent"
              onClick={toggleDrawer}
            >
              <img src={closeMenu} />
            </button>
          </li>
          {workspace && openEditWorkspaceModal && (
            <li>
              <button
                className="btn focus:outline-accent gap-2.5 rounded-lg border-none bg-white p-2.5 hover:bg-slate-100"
                onClick={openEditWorkspaceModal}
              >
                <img src={edit} />
                <p className="mr-auto">Edit workspace</p>
              </button>
            </li>
          )}
          {workspace && workspaceMembers && (
            <li>
              <MembersDropdown
                workspaceId={workspace.id}
                workspaceMembers={workspaceMembers}
              />
            </li>
          )}
          {workspaceMembers && openAddWorkspaceMembersModal && (
            <li>
              <button
                className="btn focus:outline-accent gap-2.5 rounded-lg border-none bg-white p-2.5 hover:bg-slate-100"
                onClick={openAddWorkspaceMembersModal}
              >
                <img src={addMemberDrawer} />
                <p className="mr-auto">Add member</p>
              </button>
            </li>
          )}
          <li className="mt-auto">
            <button
              className="btn focus:outline-accent gap-2.5 rounded-lg border-none bg-white p-2.5 hover:bg-slate-100"
              onClick={logoutUser}
            >
              <img src={logOut} />
              <p className="mr-auto">Log out</p>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default DrawerMenu;
