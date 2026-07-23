import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaBlog,
  FaLayerGroup,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import api from "../api/axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop sidebar
  const [open, setOpen] = useState(true);

  // Mobile sidebar
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dropdowns
  const [blogDropdown, setBlogDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  // -----------------------------
  // AUTO OPEN DROPDOWN
  // -----------------------------
  useEffect(() => {
    if (
      location.pathname === "/allblog" ||
      location.pathname === "/adminblog" ||
      location.pathname === "/likedata"
    ) {
      setBlogDropdown(true);
    }

    if (
      location.pathname === "/addcategory" ||
      location.pathname === "/allcategory"
    ) {
      setCategoryDropdown(true);
    }
  }, [location.pathname]);

  // -----------------------------
  // CLOSE MOBILE MENU ON ROUTE
  // -----------------------------
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // -----------------------------
  // PREVENT BODY SCROLL
  // -----------------------------
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // -----------------------------
  // ESCAPE KEY
  // -----------------------------
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const signout = async () => {
    try {
      await api.post("/api/logout");

      localStorage.removeItem("tokens");
      localStorage.removeItem("loggedin");
      localStorage.removeItem("user");

      setMobileOpen(false);

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // -----------------------------
  // NAVIGATION ITEM STYLE
  // -----------------------------
  const navClass = ({ isActive }) =>
    `
    group w-full flex items-center gap-3
    px-3 py-3 rounded-xl
    transition-all duration-200 ease-in-out
    ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }
    `;

  // -----------------------------
  // SUBMENU STYLE
  // -----------------------------
  const subNavClass = ({ isActive }) =>
    `
    block w-full text-left
    px-3 py-2.5 rounded-lg
    text-sm font-medium
    transition-all duration-200
    ${
      isActive
        ? "bg-blue-500/10 text-blue-400"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }
    `;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ========================================
          MOBILE TOP NAVBAR
      ======================================== */}
      <header
        className="
        md:hidden
        fixed top-0 left-0 right-0
        h-16
        bg-slate-900
        text-white
        flex items-center justify-between
        px-4
        z-40
        border-b border-slate-800
        shadow-lg
        "
      >
        <div className="min-w-0">
          <h1 className="text-lg font-bold truncate">
            Admin Panel
          </h1>

          <p className="text-xs text-slate-400 truncate">
            Dashboard System
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="
          flex items-center justify-center
          w-10 h-10
          rounded-xl
          bg-slate-800
          hover:bg-slate-700
          active:scale-95
          transition-all
          "
          aria-label="Open navigation menu"
        >
          <FaBars size={19} />
        </button>
      </header>

      {/* ========================================
          MOBILE BACKDROP
      ======================================== */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`
          md:hidden
          fixed inset-0
          bg-black/60
          backdrop-blur-sm
          z-40
          transition-all duration-300
          ${
            mobileOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible pointer-events-none"
          }
        `}
      />

      {/* ========================================
          SIDEBAR
      ======================================== */}
      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          z-50
          flex
          flex-col
          bg-slate-900
          text-white
          shadow-2xl

          transition-[width,transform]
          duration-300
          ease-in-out

          /* Mobile */
          w-[280px]
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          /* Desktop */
          md:translate-x-0

          ${
            open
              ? "md:w-72"
              : "md:w-20"
          }
        `}
      >

        {/* ========================================
            SIDEBAR HEADER
        ======================================== */}
        <div
          className="
          h-20
          flex
          items-center
          justify-between
          px-4
          border-b
          border-slate-800
          shrink-0
          "
        >
          {/* Logo / Title */}
          <div
            className={`
              overflow-hidden
              transition-all duration-300
              ${
                open
                  ? "opacity-100 w-auto"
                  : "md:opacity-0 md:w-0"
              }
            `}
          >
            <h1 className="text-xl font-bold whitespace-nowrap">
              Admin Panel
            </h1>

            <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">
              Dashboard System
            </p>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
            md:hidden
            flex
            items-center
            justify-center
            w-10 h-10
            rounded-xl
            text-slate-400
            hover:text-white
            hover:bg-slate-800
            transition
            "
            aria-label="Close navigation menu"
          >
            <FaTimes size={18} />
          </button>

          {/* Desktop collapse */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="
            hidden
            md:flex
            items-center
            justify-center
            w-10 h-10
            rounded-xl
            bg-slate-800
            text-slate-300
            hover:bg-slate-700
            hover:text-white
            transition-all
            shrink-0
            "
            title={open ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {open ? (
              <FaTimes size={15} />
            ) : (
              <FaBars size={16} />
            )}
          </button>
        </div>

        {/* ========================================
            NAVIGATION
        ======================================== */}
        <nav
          className="
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-3
          py-5
          space-y-2

          scrollbar-thin
          scrollbar-thumb-slate-700
          scrollbar-track-transparent
          "
        >

          {/* DASHBOARD */}
          <NavLink
            to="/admindashboard"
            className={navClass}
            title={!open ? "Dashboard" : ""}
          >
            <FaHome className="text-lg shrink-0" />

            <span
              className={`
                whitespace-nowrap
                overflow-hidden
                transition-all duration-300
                ${
                  open
                    ? "opacity-100 max-w-full"
                    : "md:opacity-0 md:max-w-0"
                }
              `}
            >
              Dashboard
            </span>
          </NavLink>

          {/* ========================================
              BLOGS
          ======================================== */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (!open) {
                  setOpen(true);
                }

                setBlogDropdown(!blogDropdown);
              }}
              className="
              group
              w-full
              flex
              items-center
              justify-between
              px-3
              py-3
              rounded-xl
              text-slate-300
              hover:text-white
              hover:bg-slate-800
              transition-all
              "
              title={!open ? "Blogs" : ""}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FaBlog className="text-lg shrink-0" />

                <span
                  className={`
                    whitespace-nowrap
                    overflow-hidden
                    transition-all duration-300
                    ${
                      open
                        ? "opacity-100 max-w-full"
                        : "md:opacity-0 md:max-w-0"
                    }
                  `}
                >
                  Blogs
                </span>
              </div>

              {open && (
                <span className="text-xs shrink-0">
                  {blogDropdown ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              )}
            </button>

            {/* Blog submenu */}
            <div
              className={`
                overflow-hidden
                transition-all
                duration-300
                ${
                  blogDropdown && open
                    ? "max-h-60 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div
                className="
                ml-5
                pl-3
                border-l-2
                border-slate-700
                space-y-1
                "
              >
                <NavLink
                  to="/allblog"
                  className={subNavClass}
                >
                  All Blogs
                </NavLink>

                <NavLink
                  to="/adminblog"
                  className={subNavClass}
                >
                  Add Blog
                </NavLink>

                <NavLink
                  to="/likedata"
                  className={subNavClass}
                >
                  All Likes
                </NavLink>
              </div>
            </div>
          </div>

          {/* ========================================
              CATEGORIES
          ======================================== */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (!open) {
                  setOpen(true);
                }

                setCategoryDropdown(
                  !categoryDropdown
                );
              }}
              className="
              group
              w-full
              flex
              items-center
              justify-between
              px-3
              py-3
              rounded-xl
              text-slate-300
              hover:text-white
              hover:bg-slate-800
              transition-all
              "
              title={!open ? "Categories" : ""}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FaLayerGroup className="text-lg shrink-0" />

                <span
                  className={`
                    whitespace-nowrap
                    overflow-hidden
                    transition-all duration-300
                    ${
                      open
                        ? "opacity-100 max-w-full"
                        : "md:opacity-0 md:max-w-0"
                    }
                  `}
                >
                  Categories
                </span>
              </div>

              {open && (
                <span className="text-xs shrink-0">
                  {categoryDropdown ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </span>
              )}
            </button>

            {/* Category submenu */}
            <div
              className={`
                overflow-hidden
                transition-all
                duration-300
                ${
                  categoryDropdown && open
                    ? "max-h-60 opacity-100 mt-2"
                    : "max-h-0 opacity-0"
                }
              `}
            >
              <div
                className="
                ml-5
                pl-3
                border-l-2
                border-slate-700
                space-y-1
                "
              >
                <NavLink
                  to="/addcategory"
                  className={subNavClass}
                >
                  Add Category
                </NavLink>

                <NavLink
                  to="/allcategory"
                  className={subNavClass}
                >
                  All Categories
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* ========================================
            USER / LOGOUT
        ======================================== */}
        <div
          className="
          p-3
          border-t
          border-slate-800
          shrink-0
          "
        >
          <div
            className={`
              rounded-xl
              bg-slate-800/70
              transition-all
              ${
                open
                  ? "p-3"
                  : "md:p-2"
              }
            `}
          >
            {open ? (
              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">
                    Logged in as
                  </p>

                  <h2 className="text-sm font-semibold text-white truncate">
                    Admin User
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={signout}
                  className="
                  flex
                  items-center
                  justify-center
                  w-10 h-10
                  shrink-0
                  rounded-lg
                  text-red-400
                  bg-red-500/10
                  hover:bg-red-500
                  hover:text-white
                  transition-all
                  "
                  title="Sign out"
                >
                  <FaSignOutAlt size={16} />
                </button>

              </div>
            ) : (
              <button
                type="button"
                onClick={signout}
                className="
                hidden
                md:flex
                w-full
                items-center
                justify-center
                p-2.5
                rounded-lg
                text-red-400
                hover:bg-red-500/10
                hover:text-red-300
                transition
                "
                title="Sign out"
              >
                <FaSignOutAlt size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <main
        className={`
          min-h-screen

          pt-16
          md:pt-0

          transition-all
          duration-300
          ease-in-out

          ${
            open
              ? "md:ml-72"
              : "md:ml-20"
          }
        `}
      >
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default Sidebar;