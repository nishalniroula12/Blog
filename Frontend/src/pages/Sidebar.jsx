import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import api from "../api/axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop collapse state
  const [open, setOpen] = useState(true);

  // Mobile drawer visibility
  const [mobileOpen, setMobileOpen] = useState(false);

  // Accordion states
  const [blogDropdown, setBlogDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const signout = async () => {
    try {
      const res = await api.post("api/logout");
      localStorage.removeItem("tokens");
      localStorage.removeItem("loggedin");
      localStorage.removeItem("user");
      console.log(res);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-40 border-b border-slate-800 shadow-md">
        <div>
          <h1 className="text-lg font-bold tracking-wide">Admin Panel</h1>
          <p className="text-slate-400 text-xs">Dashboard System</p>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* ---------------- MOBILE OVERLAY BACKDROP ---------------- */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* ---------------- SIDEBAR WRAPPER ---------------- */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-slate-900 text-white shadow-2xl
          flex flex-col
          transition-all duration-300 ease-in-out
          
          /* Mobile Drawer Positioning */
          ${mobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"}
          
          /* Desktop Responsive Overrides */
          md:translate-x-0
          ${open ? "md:w-72" : "md:w-20"}
        `}
      >
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 h-20 shrink-0">
          {(open || mobileOpen) && (
            <div>
              <h1 className="text-xl font-bold tracking-wide whitespace-nowrap">
                Admin Panel
              </h1>
              <p className="text-slate-400 text-xs mt-0.5 whitespace-nowrap">
                Dashboard System
              </p>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            <FaTimes size={18} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="hidden md:flex items-center justify-center text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg transition"
            title={open ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {open ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {/* DASHBOARD LINK */}
          <button
            onClick={() => navigate("/admindashboard")}
            title="Dashboard"
            className="
              w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl
              text-slate-300 hover:text-white hover:bg-slate-800
              transition duration-200 group text-left
            "
          >
            <FaHome className="text-lg shrink-0 text-slate-400 group-hover:text-blue-400 transition" />
            {(open || mobileOpen) && (
              <span className="font-medium text-sm whitespace-nowrap">
                Dashboard
              </span>
            )}
          </button>

          {/* BLOGS ACCORDION */}
          <div>
            <button
              onClick={() => {
                if (!open && !mobileOpen) setOpen(true);
                setBlogDropdown(!blogDropdown);
              }}
              title="Blogs"
              className="
                w-full flex items-center justify-between px-3.5 py-3 rounded-xl
                text-slate-300 hover:text-white hover:bg-slate-800
                transition duration-200 group
              "
            >
              <div className="flex items-center gap-3.5">
                <FaBlog className="text-lg shrink-0 text-slate-400 group-hover:text-blue-400 transition" />
                {(open || mobileOpen) && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    Blogs
                  </span>
                )}
              </div>

              {(open || mobileOpen) && (
                <span className="text-slate-400 text-xs">
                  {blogDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </button>

            {blogDropdown && (open || mobileOpen) && (
              <div className="ml-9 mt-1.5 flex flex-col gap-1 border-l-2 border-slate-800 pl-3">
                <button
                  onClick={() => navigate("/allblog")}
                  className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  All Blogs
                </button>
                <button
                  onClick={() => navigate("/adminblog")}
                  className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Add Blog
                </button>
                <button
                  onClick={() => navigate("/likedata")}
                  className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  All Likes
                </button>
              </div>
            )}
          </div>

          {/* CATEGORIES ACCORDION */}
          <div>
            <button
              onClick={() => {
                if (!open && !mobileOpen) setOpen(true);
                setCategoryDropdown(!categoryDropdown);
              }}
              title="Categories"
              className="
                w-full flex items-center justify-between px-3.5 py-3 rounded-xl
                text-slate-300 hover:text-white hover:bg-slate-800
                transition duration-200 group
              "
            >
              <div className="flex items-center gap-3.5">
                <FaLayerGroup className="text-lg shrink-0 text-slate-400 group-hover:text-blue-400 transition" />
                {(open || mobileOpen) && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    Categories
                  </span>
                )}
              </div>

              {(open || mobileOpen) && (
                <span className="text-slate-400 text-xs">
                  {categoryDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </button>

            {categoryDropdown && (open || mobileOpen) && (
              <div className="ml-9 mt-1.5 flex flex-col gap-1 border-l-2 border-slate-800 pl-3">
                <button
                  onClick={() => navigate("/addcategory")}
                  className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Add Category
                </button>
                <button
                  onClick={() => navigate("/allcategory")}
                  className="text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  All Categories
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER / USER PROFILE & LOGOUT */}
        <div className="p-4 border-t border-slate-800 shrink-0">
          {open || mobileOpen ? (
            <div className="bg-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-slate-400 truncate">Logged in as</p>
                <h2 className="text-sm font-semibold text-white truncate">
                  Admin User
                </h2>
              </div>
              <button
                onClick={signout}
                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition duration-200"
                title="Sign out"
              >
                <FaSignOutAlt size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={signout}
              title="Sign out"
              className="w-full flex items-center justify-center p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition"
            >
              <FaSignOutAlt size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT WRAPPER ---------------- */}
      <div
        className={`
          pt-16 md:pt-0
          transition-all duration-300
          ${open ? "md:ml-72" : "md:ml-20"}
        `}
      >
        {/* Render child pages/routes here */}
      </div>
    </>
  );
};

export default Sidebar;