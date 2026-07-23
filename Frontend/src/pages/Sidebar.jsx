import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet, NavLink } from "react-router-dom";

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

  // ---------------------------------
  // DESKTOP SIDEBAR
  // ---------------------------------
  const [open, setOpen] = useState(true);

  // ---------------------------------
  // MOBILE SIDEBAR
  // ---------------------------------
  const [mobileOpen, setMobileOpen] = useState(false);

  // ---------------------------------
  // DROPDOWNS
  // ---------------------------------
  const [blogDropdown, setBlogDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] =
    useState(false);

  // ---------------------------------
  // CLOSE MOBILE SIDEBAR
  // WHEN ROUTE CHANGES
  // ---------------------------------
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ---------------------------------
  // BODY SCROLL
  // ---------------------------------
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

  // ---------------------------------
  // ESCAPE KEY
  // ---------------------------------
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // ---------------------------------
  // AUTO OPEN DROPDOWN
  // ---------------------------------
  useEffect(() => {
    if (
      location.pathname === "/allblog" ||
      location.pathname === "/adminblog" ||
      location.pathname === "/likedata"
    ) {
      setBlogDropdown(true);
    }

    if (
      location.pathname === "/allcategory" ||
      location.pathname === "/addcategory"
    ) {
      setCategoryDropdown(true);
    }
  }, [location.pathname]);

  // ---------------------------------
  // LOGOUT
  // ---------------------------------
  const signout = async () => {
    try {
      await api.post("/api/logout");

      localStorage.removeItem("tokens");
      localStorage.removeItem("loggedin");
      localStorage.removeItem("user");

      setMobileOpen(false);

      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

      // Logout locally even if API fails
      localStorage.removeItem("tokens");
      localStorage.removeItem("loggedin");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  // ---------------------------------
  // CLOSE MOBILE MENU
  // ---------------------------------
  const closeMobile = () => {
    setMobileOpen(false);
  };

  // ---------------------------------
  // NAVIGATION CLASS
  // ---------------------------------
  const navClass = ({ isActive }) => `
    flex
    items-center
    gap-3
    w-full
    px-4
    py-3
    rounded-xl
    transition-all
    duration-200
    ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }
  `;

  // ---------------------------------
  // SUB NAVIGATION CLASS
  // ---------------------------------
  const subNavClass = ({ isActive }) => `
    block
    w-full
    text-left
    px-4
    py-2
    rounded-lg
    transition
    ${
      isActive
        ? "bg-blue-500/20 text-blue-400"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }
  `;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header
        className="
          fixed
          top-0
          left-0
          right-0
          h-16
          bg-slate-900
          text-white
          flex
          items-center
          justify-between
          px-4
          z-40
          md:hidden
          shadow-lg
        "
      >

        <div>
          <h1 className="text-lg font-bold">
            Admin Panel
          </h1>

          <p className="text-xs text-slate-400">
            Dashboard System
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setMobileOpen(true)
          }
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-lg
            bg-slate-800
            hover:bg-slate-700
            transition
          "
        >
          <FaBars size={18} />
        </button>

      </header>


      {/* =====================================================
          MOBILE BACKDROP

          ONLY EXISTS WHEN SIDEBAR IS OPEN
      ====================================================== */}

      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
        />
      )}


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          bg-gradient-to-b
          from-slate-900
          to-slate-800
          text-white
          shadow-2xl
          z-50

          flex
          flex-col

          transition-all
          duration-300
          ease-in-out

          /* MOBILE */

          w-[280px]

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          /* DESKTOP */

          md:translate-x-0

          ${
            open
              ? "md:w-72"
              : "md:w-20"
          }
        `}
      >

        {/* =================================================
            SIDEBAR TOP
        ================================================== */}

        <div
          className="
            h-20
            flex
            items-center
            justify-between
            p-5
            border-b
            border-slate-700
            shrink-0
          "
        >

          {/* Logo */}

          {open && (
            <div>
              <h1 className="text-xl font-bold tracking-wide">
                Admin Panel
              </h1>

              <p className="text-slate-400 text-xs mt-1">
                Dashboard System
              </p>
            </div>
          )}


          {/* Mobile Close */}

          <button
            type="button"
            onClick={closeMobile}
            className="
              md:hidden
              w-10
              h-10
              flex
              items-center
              justify-center
              rounded-lg
              bg-slate-800
              hover:bg-slate-700
            "
          >
            <FaTimes />
          </button>


          {/* Desktop Collapse */}

          <button
            type="button"
            onClick={() =>
              setOpen(!open)
            }
            className="
              hidden
              md:flex
              w-10
              h-10
              items-center
              justify-center
              rounded-lg
              bg-slate-700
              hover:bg-slate-600
            "
          >
            {open ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>


        {/* =================================================
            MENU
        ================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            p-4
            space-y-3
          "
        >

          {/* ================= DASHBOARD ================= */}

          <NavLink
            to="/admindashboard"
            onClick={closeMobile}
            className={navClass}
          >
            <FaHome className="text-lg shrink-0" />

            {open && (
              <span className="font-medium">
                Dashboard
              </span>
            )}
          </NavLink>


          {/* ================= BLOG ================= */}

          <div>

            <button
              type="button"
              onClick={() => {

                // If desktop collapsed
                // expand it
                if (!open) {
                  setOpen(true);
                }

                setBlogDropdown(
                  !blogDropdown
                );
              }}
              className="
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                rounded-xl
                text-slate-300
                hover:bg-slate-700
                hover:text-white
                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <FaBlog className="text-lg" />

                {open && (
                  <span className="font-medium">
                    Blogs
                  </span>
                )}

              </div>


              {open && (
                blogDropdown
                  ? <FaChevronUp />
                  : <FaChevronDown />
              )}

            </button>


            {/* BLOG MENU */}

            {blogDropdown && open && (

              <div
                className="
                  ml-6
                  mt-2
                  flex
                  flex-col
                  gap-1
                  border-l-2
                  border-slate-700
                  pl-3
                "
              >

                <NavLink
                  to="/allblog"
                  onClick={closeMobile}
                  className={subNavClass}
                >
                  All Blogs
                </NavLink>


                <NavLink
                  to="/adminblog"
                  onClick={closeMobile}
                  className={subNavClass}
                >
                  Add Blog
                </NavLink>


                <NavLink
                  to="/likedata"
                  onClick={closeMobile}
                  className={subNavClass}
                >
                  All Likes
                </NavLink>

              </div>

            )}

          </div>


          {/* ================= CATEGORY ================= */}

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
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                rounded-xl
                text-slate-300
                hover:bg-slate-700
                hover:text-white
                transition
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <FaLayerGroup className="text-lg" />

                {open && (
                  <span className="font-medium">
                    Categories
                  </span>
                )}

              </div>


              {open && (
                categoryDropdown
                  ? <FaChevronUp />
                  : <FaChevronDown />
              )}

            </button>


            {/* CATEGORY MENU */}

            {categoryDropdown && open && (

              <div
                className="
                  ml-6
                  mt-2
                  flex
                  flex-col
                  gap-1
                  border-l-2
                  border-slate-700
                  pl-3
                "
              >

                <NavLink
                  to="/addcategory"
                  onClick={closeMobile}
                  className={subNavClass}
                >
                  Add Category
                </NavLink>


                <NavLink
                  to="/allcategory"
                  onClick={closeMobile}
                  className={subNavClass}
                >
                  All Categories
                </NavLink>

              </div>

            )}

          </div>

        </nav>


        {/* =================================================
            BOTTOM / LOGOUT
        ================================================== */}

        <div
          className="
            p-4
            border-t
            border-slate-700
            shrink-0
          "
        >

          {open ? (

            <div
              className="
                bg-slate-800
                rounded-xl
                p-3
                flex
                items-center
                justify-between
                gap-3
              "
            >

              <div className="min-w-0">

                <p className="text-xs text-slate-400">
                  Logged in as
                </p>

                <h2 className="font-semibold truncate">
                  Admin User
                </h2>

              </div>


              <button
                type="button"
                onClick={signout}
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  rounded-lg
                  bg-black
                  text-white
                  hover:bg-red-500
                  transition
                "
                title="Signout"
              >
                <FaSignOutAlt />
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
                p-3
                rounded-lg
                text-red-400
                hover:bg-red-500/10
              "
            >
              <FaSignOutAlt />
            </button>

          )}

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className={`
          min-h-screen

          pt-16
          md:pt-0

          transition-all
          duration-300

          ${
            open
              ? "md:ml-72"
              : "md:ml-20"
          }
        `}
      >

        <div
          className="
            min-h-screen
            p-4
            sm:p-6
            lg:p-8
          "
        >

          <Outlet />

        </div>

      </main>

    </div>
  );
};

export default Sidebar;