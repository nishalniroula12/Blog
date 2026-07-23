import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet, NavLink } from "react-router-dom";
import {
  FaEllipsisV,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaBlog,
  FaLayerGroup,
  FaSignOutAlt,
} from "react-icons/fa";

import api from "../api/axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // STATES
  // ==========================================
  // Desktop/tablet: start expanded on large screens, collapsed on tablets
  const [open, setOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [blogDropdown, setBlogDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  // ==========================================
  // ROUTE CHANGE & ESC KEY LISTENERS
  // ==========================================
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Keep sidebar state sensible when the window is resized
  // (e.g. rotating a tablet, or dragging a browser window between sizes)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // mobile: sidebar itself is irrelevant, drawer handles it
        return;
      }
      if (window.innerWidth < 1024) {
        setOpen(false); // tablet: default to collapsed/icon-only
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-expand submenus when visiting matched routes
  useEffect(() => {
    if (
      ["/allblog", "/adminblog", "/likedata"].some((path) =>
        location.pathname.startsWith(path)
      )
    ) {
      setBlogDropdown(true);
    }

    if (
      ["/allcategory", "/addcategory"].some((path) =>
        location.pathname.startsWith(path)
      )
    ) {
      setCategoryDropdown(true);
    }
  }, [location.pathname]);

  // ==========================================
  // LOGOUT HANDLER
  // ==========================================
  const signout = async () => {
    try {
      await api.post("/api/logout");
    } catch (error) {
      console.error("Logout API failed, logging out locally:", error);
    } finally {
      localStorage.removeItem("tokens");
      localStorage.removeItem("loggedin");
      localStorage.removeItem("user");
      setMobileOpen(false);
      navigate("/login");
    }
  };

  const closeMobile = () => setMobileOpen(false);

  // NavLink styling generators
  const navClass = ({ isActive }) => `
    flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
    ${
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }
  `;

  const subNavClass = ({ isActive }) => `
    block w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors
    ${
      isActive
        ? "bg-blue-500/20 text-blue-400 font-semibold"
        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
    }
  `;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100 flex flex-col">
      {/* MOBILE / TABLET TOPBAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-40 lg:hidden shadow-lg border-b border-slate-800">
        <div className="min-w-0">
          <h1 className="text-base font-bold tracking-wide truncate">Admin Panel</h1>
          <p className="text-[10px] text-slate-400 truncate">Dashboard System</p>
        </div>

        {/* THREE DOT MENU TRIGGER */}
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 transition"
          aria-label="Open menu"
        >
          <FaEllipsisV size={18} />
        </button>
      </header>

      {/* BACKDROP (mobile + tablet drawer) */}
      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`
          fixed top-0 left-0 h-screen h-[100dvh] bg-slate-900 text-white shadow-2xl z-50 flex flex-col
          transition-all duration-300 ease-in-out border-r border-slate-800
          w-[82vw] max-w-[300px]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:max-w-none ${open ? "lg:w-72" : "lg:w-20"}
        `}
      >
        {/* HEADER / LOGO */}
        <div className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-5 border-b border-slate-800 shrink-0">
          {open ? (
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-wide text-white truncate">
                Admin Panel
              </h1>
              <p className="text-slate-400 text-xs truncate">Dashboard System</p>
            </div>
          ) : (
            <div className="mx-auto hidden lg:block">
              <span className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                AP
              </span>
            </div>
          )}

          {/* MOBILE/TABLET CLOSE (three-dot drawer close) */}
          <button
            type="button"
            onClick={closeMobile}
            className="lg:hidden w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
            aria-label="Close menu"
          >
            <FaTimes size={16} />
          </button>

          {/* DESKTOP COLLAPSE TOGGLE */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="hidden lg:flex w-9 h-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <FaTimes size={14} /> : <FaEllipsisV size={14} />}
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 min-h-0">
          {/* DASHBOARD */}
          <NavLink
            to="/admindashboard"
            onClick={closeMobile}
            className={navClass}
            title={!open ? "Dashboard" : undefined}
          >
            <FaHome className="text-lg shrink-0" />
            {open && <span className="truncate">Dashboard</span>}
          </NavLink>

          {/* BLOGS DROPDOWN */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (!open) setOpen(true);
                setBlogDropdown(!blogDropdown);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium"
              title={!open ? "Blogs" : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FaBlog className="text-lg shrink-0" />
                {open && <span className="truncate">Blogs</span>}
              </div>
              {open && (
                <span className="text-xs text-slate-400 shrink-0">
                  {blogDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </button>

            {blogDropdown && open && (
              <div className="ml-5 mt-1.5 flex flex-col gap-1 border-l-2 border-slate-800 pl-3">
                <NavLink to="/allblog" onClick={closeMobile} className={subNavClass}>
                  All Blogs
                </NavLink>
                <NavLink to="/adminblog" onClick={closeMobile} className={subNavClass}>
                  Add Blog
                </NavLink>
                <NavLink to="/likedata" onClick={closeMobile} className={subNavClass}>
                  All Likes
                </NavLink>
              </div>
            )}
          </div>

          {/* CATEGORIES DROPDOWN */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (!open) setOpen(true);
                setCategoryDropdown(!categoryDropdown);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm font-medium"
              title={!open ? "Categories" : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FaLayerGroup className="text-lg shrink-0" />
                {open && <span className="truncate">Categories</span>}
              </div>
              {open && (
                <span className="text-xs text-slate-400 shrink-0">
                  {categoryDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </button>

            {categoryDropdown && open && (
              <div className="ml-5 mt-1.5 flex flex-col gap-1 border-l-2 border-slate-800 pl-3">
                <NavLink to="/addcategory" onClick={closeMobile} className={subNavClass}>
                  Add Category
                </NavLink>
                <NavLink to="/allcategory" onClick={closeMobile} className={subNavClass}>
                  All Categories
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        {/* LOGOUT / PROFILE FOOTER */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          {open ? (
            <div className="bg-slate-800/60 rounded-xl p-3 flex items-center justify-between gap-3 border border-slate-700/50">
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Logged in
                </p>
                <h2 className="text-xs font-semibold text-white truncate">
                  Admin User
                </h2>
              </div>

              <button
                type="button"
                onClick={signout}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                title="Sign out"
                aria-label="Sign out"
              >
                <FaSignOutAlt size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signout}
              className="hidden lg:flex w-full items-center justify-center p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
              title="Sign out"
              aria-label="Sign out"
            >
              <FaSignOutAlt size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT OUTLET */}
      <main
        className={`
          flex-1 min-w-0 transition-all duration-300 pt-16 lg:pt-0
          ${open ? "lg:ml-72" : "lg:ml-20"}
        `}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Sidebar;