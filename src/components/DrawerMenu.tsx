import { useState, type PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@contexts/AuthProvider";
import openMenu from "@images/open-menu.svg";
import closeMenu from "@images/close-menu.svg";
import logOut from "@images/log-out.svg";
import logo from "@images/logo.svg";
import delay from "@utils/delay";

function DrawerMenu({ children }: PropsWithChildren) {
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
  };

  const logoutUser = async () => {
    await logout();
    navigate("/log-in");
    toast.info("You've successfully logged out.");
  };

  return (
    <div className="drawer z-10 min-h-svh">
      <input
        id="my-drawer-5"
        type="checkbox"
        checked={checked}
        onChange={toggleDrawer}
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
              <img src={openMenu} />
            </label>
          </nav>
          <div className="xs:absolute xs:top-1/2 xs:left-1/2 xs:-translate-x-1/2 xs:-translate-y-1/2 mx-auto">
            <img src={logo} alt="Flowspace logo" />
          </div>
        </header>
        {children}
      </div>
      <nav className="drawer-side">
        <label
          htmlFor="my-drawer-5"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4 font-bold text-black">
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
          <li className="mt-auto">
            <button
              className="btn focus:outline-accent gap-2.5 rounded-lg border-none bg-white p-2.5 text-black hover:bg-slate-100"
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
