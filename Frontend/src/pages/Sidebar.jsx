import React, { useEffect, useRef, useState } from "react";
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

  // Desktop sidebar (collapsed / expanded)
  const [open, setOpen] = useState(true);

  // Mobile drawer
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dropdowns
  const [blogDropdown, setBlogDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  // Sign-out confirmation + loading state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const drawerRef = useRef(null);
  const firstFocusableRef = useRef(null);

  const adminName =
    (() => {
      try {
        return JSON.parse(localStorage.getItem("user"))?.name || "Admin User";
      } catch {
        return "Admin User";
      }
    })();

  const initials = adminName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // -----------------------------
  // AUTO OPEN DROPDOWN BASED ON ROUTE
  // -----------------------------
  useEffect(() => {
    if (
      ["/allblog", "/adminblog", "/likedata"].includes(location.pathname)
    ) {
      setBlogDropdown(true);
    }

    if (["/addcategory", "/allcategory"].includes(location.pathname)) {
      setCategoryDropdown(true);
    }
  }, [location.pathname]);

  // -----------------------------
  // CLOSE MOBILE DRAWER ON ROUTE CHANGE
  // -----------------------------
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // -----------------------------
  // LOCK BODY SCROLL WHEN DRAWER / MODAL OPEN
  // -----------------------------
  useEffect(() => {
    document.body.style.overflow =
      mobileOpen || confirmOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, confirmOpen]);

  // -----------------------------
  // ESCAPE KEY CLOSES DRAWER / MODAL
  // -----------------------------
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      if (confirmOpen) setConfirmOpen(false);
      else if (mobileOpen) setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen, confirmOpen]);

  // -----------------------------
  // BASIC FOCUS TRAP FOR THE CONFIRM MODAL
  // -----------------------------
  useEffect(() => {
    if (confirmOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [confirmOpen]);

  // -----------------------------
  // SIGN OUT
  // -----------------------------
  const performSignOut = async () => {
    setSigningOut(true);
    try {
      await api.post("/api/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("tokens");
      localStorage.removeItem("loggedin");
      localStorage.removeItem("user");
      setSigningOut(false);
      setConfirmOpen(false);
      setMobileOpen(false);
      navigate("/login");
    }
  };

  // -----------------------------
  // STYLE HELPERS
  // -----------------------------
  const navClass = ({ isActive }) =>
    `group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl
    transition-all duration-200 ease-in-out
    ${
      isActive
        ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-600/30"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const subNavClass = ({ isActive }) =>
    `block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium
    transition-all duration-200
    ${
      isActive
        ? "bg-indigo-500/10 text-indigo-400"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  const navItems = [
    { to: "/admindashboard", label: "Dashboard", icon: FaHome },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ========================================
          MOBILE TOP BAR
      ======================================== */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white
        flex items-center justify-between px-4 z-40 border-b border-slate-800 shadow-lg"
      >
        <div className="min-w-0 flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold truncate leading-tight">
              Admin Panel
            </h1>
            <p className="text-[11px] text-slate-400 truncate leading-tight">
              Dashboard System
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800
          hover:bg-slate-700 active:scale-95 transition-all"
          aria-label="Open navigation menu"
        >
          <FaBars size={18} />
        </button>
      </header>

      {/* ========================================
          MOBILE BACKDROP
      ======================================== */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40
        transition-opacity duration-300
        ${mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      />

      {/* ========================================
          SIDEBAR / DRAWER
      ======================================== */}
      <aside
        ref={drawerRef}
        role="navigation"
        aria-label="Admin sidebar"
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col bg-slate-900 text-white shadow-2xl
        transition-[width,transform] duration-300 ease-in-out
        w-[280px] max-w-[85vw]
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${open ? "md:w-72" : "md:w-20"}`}
      >
        {/* HEADER */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div
            className={`flex items-center gap-3 overflow-hidden transition-all duration-300
            ${open ? "opacity-100 w-auto" : "md:opacity-0 md:w-0"}`}
          >
            <div className="w-9 h-9 shrink-0 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold whitespace-nowrap leading-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400 whitespace-nowrap leading-tight">
                Dashboard System
              </p>
            </div>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl
            text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close navigation menu"
          >
            <FaTimes size={18} />
          </button>

          {/* Desktop collapse */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl
            bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all shrink-0"
            title={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <FaTimes size={15} /> : <FaBars size={16} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav
          className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 space-y-2
          scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
        >
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={navClass} title={!open ? label : ""}>
              <Icon className="text-lg shrink-0" />
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-300
                ${open ? "opacity-100 max-w-full" : "md:opacity-0 md:max-w-0"}`}
              >
                {label}
              </span>
            </NavLink>
          ))}

          {/* BLOGS DROPDOWN */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (!open) setOpen(true);
                setBlogDropdown(!blogDropdown);
              }}
              className="group w-full flex items-center justify-between px-3 py-3 rounded-xl
              text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title={!open ? "Blogs" : ""}
              aria-expanded={blogDropdown}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FaBlog className="text-lg shrink-0" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300
                  ${open ? "opacity-100 max-w-full" : "md:opacity-0 md:max-w-0"}`}
                >
                  Blogs
                </span>
              </div>
              {open && (
                <span className="text-xs shrink-0">
                  {blogDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300
              ${blogDropdown && open ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
            >
              <div className="ml-5 pl-3 border-l-2 border-slate-700 space-y-1">
                <NavLink to="/allblog" className={subNavClass}>
                  All Blogs
                </NavLink>
                <NavLink to="/adminblog" className={subNavClass}>
                  Add Blog
                </NavLink>
                <NavLink to="/likedata" className={subNavClass}>
                  All Likes
                </NavLink>
              </div>
            </div>
          </div>

          {/* CATEGORIES DROPDOWN */}
          <div>
            <button
              type="button"
              onClick={() => {
                if (!open) setOpen(true);
                setCategoryDropdown(!categoryDropdown);
              }}
              className="group w-full flex items-center justify-between px-3 py-3 rounded-xl
              text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              title={!open ? "Categories" : ""}
              aria-expanded={categoryDropdown}
            >
              <div className="flex items-center gap-3 min-w-0">
                <FaLayerGroup className="text-lg shrink-0" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300
                  ${open ? "opacity-100 max-w-full" : "md:opacity-0 md:max-w-0"}`}
                >
                  Categories
                </span>
              </div>
              {open && (
                <span className="text-xs shrink-0">
                  {categoryDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300
              ${categoryDropdown && open ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
            >
              <div className="ml-5 pl-3 border-l-2 border-slate-700 space-y-1">
                <NavLink to="/addcategory" className={subNavClass}>
                  Add Category
                </NavLink>
                <NavLink to="/allcategory" className={subNavClass}>
                  All Categories
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        {/* USER / SIGN OUT */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          <div
            className={`rounded-xl bg-slate-800/70 transition-all ${
              open ? "p-3" : "md:p-2"
            }`}
          >
            {open ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Logged in as
                    </p>
                    <h2 className="text-sm font-semibold text-white truncate leading-tight">
                      {adminName}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  className="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg
                  text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <FaSignOutAlt size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="hidden md:flex w-full items-center justify-center p-2.5 rounded-lg
                text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
                title="Sign out"
                aria-label="Sign out"
              >
                <FaSignOutAlt size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================
          SIGN-OUT CONFIRMATION MODAL
      ======================================== */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signout-title"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !signingOut && setConfirmOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 p-6 animate-[fadeIn_0.15s_ease-out]">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
              <FaSignOutAlt size={20} />
            </div>

            <h2 id="signout-title" className="text-lg font-bold mb-1">
              Sign out?
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              You'll need to log in again to access the admin panel.
            </p>

            <div className="flex gap-3">
              <button
                ref={firstFocusableRef}
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={signingOut}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300
                hover:bg-slate-700 hover:text-white transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={performSignOut}
                disabled={signingOut}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold
                hover:bg-red-600 transition disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {signingOut ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing out
                  </>
                ) : (
                  "Sign out"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          MOBILE BOTTOM QUICK-NAV (thumb reach)
      ======================================== */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800
        flex items-center justify-around z-30 pb-[env(safe-area-inset-bottom)]"
      >
        <NavLink
          to="/admindashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] flex-1 h-full
            ${isActive ? "text-indigo-400" : "text-slate-400"}`
          }
        >
          <FaHome size={18} />
          Home
        </NavLink>
        <NavLink
          to="/allblog"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] flex-1 h-full
            ${isActive ? "text-indigo-400" : "text-slate-400"}`
          }
        >
          <FaBlog size={18} />
          Blogs
        </NavLink>
        <NavLink
          to="/allcategory"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 text-[11px] flex-1 h-full
            ${isActive ? "text-indigo-400" : "text-slate-400"}`
          }
        >
          <FaLayerGroup size={18} />
          Categories
        </NavLink>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-[11px] flex-1 h-full text-red-400"
        >
          <FaSignOutAlt size={18} />
          Sign out
        </button>
      </nav>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}
      <main
        className={`min-h-screen pt-16 pb-16 md:pb-0 md:pt-0 transition-all duration-300 ease-in-out
        ${open ? "md:ml-72" : "md:ml-20"}`}
      >
        <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Sidebar;